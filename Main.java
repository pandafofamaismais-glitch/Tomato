import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.concurrent.Executors;

public class Main {
    private static final int PORT = 8080;
    private static final Path ROOT = Paths.get("public").toAbsolutePath().normalize();

    public static void main(String[] args) throws IOException {
        if (!Files.isDirectory(ROOT)) {
            System.err.println("Pasta 'public' não encontrada. Execute o programa na raiz do projeto.");
            System.exit(1);
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/", Main::handleRequest);
        server.setExecutor(Executors.newCachedThreadPool());
        server.start();

        System.out.println("Tomato Animes está rodando em http://localhost:" + PORT);
        System.out.println("Para encerrar, pressione Ctrl+C neste terminal.");
    }

    private static void handleRequest(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if (!"GET".equalsIgnoreCase(method) && !"HEAD".equalsIgnoreCase(method)) {
            sendText(exchange, 405, "Método não permitido");
            return;
        }

        String rawPath = exchange.getRequestURI().getRawPath();
        String decodedPath = URLDecoder.decode(rawPath, StandardCharsets.UTF_8);
        if (decodedPath.equals("/")) decodedPath = "/index.html";

        Path target = ROOT.resolve("." + decodedPath).normalize();
        if (!target.startsWith(ROOT)) {
            sendText(exchange, 403, "Acesso negado");
            return;
        }

        if (!Files.exists(target) || Files.isDirectory(target)) {
            sendText(exchange, 404, "Arquivo não encontrado");
            return;
        }

        String contentType = contentType(target);
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", contentType);
        headers.set("X-Content-Type-Options", "nosniff");
        headers.set("Accept-Ranges", "bytes");
        headers.set("Cache-Control", "no-cache");

        long size = Files.size(target);
        String range = exchange.getRequestHeaders().getFirst("Range");
        if (range != null && range.startsWith("bytes=") && contentType.startsWith("video/")) {
            serveRange(exchange, target, size, range, method.equalsIgnoreCase("HEAD"));
            return;
        }

        headers.set("Content-Length", String.valueOf(size));
        if (method.equalsIgnoreCase("HEAD")) {
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
            return;
        }

        exchange.sendResponseHeaders(200, size);
        try (OutputStream out = exchange.getResponseBody()) {
            Files.copy(target, out);
        }
    }

    private static void serveRange(HttpExchange exchange, Path file, long size, String range, boolean head)
            throws IOException {
        try {
            String spec = range.substring("bytes=".length()).split(",", 2)[0].trim();
            String[] parts = spec.split("-", 2);
            long start = Long.parseLong(parts[0]);
            long end = parts.length > 1 && !parts[1].isEmpty()
                    ? Long.parseLong(parts[1]) : size - 1;
            if (start < 0 || end < start || start >= size) {
                exchange.getResponseHeaders().set("Content-Range", "bytes */" + size);
                exchange.sendResponseHeaders(416, -1);
                exchange.close();
                return;
            }
            end = Math.min(end, size - 1);
            long length = end - start + 1;
            Headers headers = exchange.getResponseHeaders();
            headers.set("Content-Range", "bytes " + start + "-" + end + "/" + size);
            headers.set("Content-Length", String.valueOf(length));
            if (head) {
                exchange.sendResponseHeaders(206, -1);
                exchange.close();
                return;
            }
            exchange.sendResponseHeaders(206, length);
            try (var channel = java.nio.channels.FileChannel.open(file);
                 OutputStream out = exchange.getResponseBody()) {
                channel.position(start);
                java.nio.ByteBuffer buffer = java.nio.ByteBuffer.allocate(64 * 1024);
                long remaining = length;
                while (remaining > 0) {
                    buffer.clear();
                    buffer.limit((int) Math.min(buffer.capacity(), remaining));
                    int read = channel.read(buffer);
                    if (read < 0) break;
                    out.write(buffer.array(), 0, read);
                    remaining -= read;
                }
            }
        } catch (NumberFormatException | IndexOutOfBoundsException ex) {
            exchange.getResponseHeaders().set("Content-Range", "bytes */" + size);
            exchange.sendResponseHeaders(416, -1);
            exchange.close();
        }
    }

    private static String contentType(Path path) {
        String name = path.getFileName().toString().toLowerCase(Locale.ROOT);
        if (name.endsWith(".html")) return "text/html; charset=utf-8";
        if (name.endsWith(".css")) return "text/css; charset=utf-8";
        if (name.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (name.endsWith(".json")) return "application/json; charset=utf-8";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".webp")) return "image/webp";
        if (name.endsWith(".svg")) return "image/svg+xml";
        if (name.endsWith(".mp4")) return "video/mp4";
        if (name.endsWith(".webm")) return "video/webm";
        if (name.endsWith(".ogg")) return "video/ogg";
        if (name.endsWith(".ico")) return "image/x-icon";
        return "application/octet-stream";
    }

    private static void sendText(HttpExchange exchange, int status, String message) throws IOException {
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(bytes);
        }
    }
}
