#!/usr/bin/env python3
"""
Critter Bonk - Official Project Entry Point
Serves the web/ directory over a local HTTP server.
"""

import http.server
import os
import socketserver
import sys

HOST = "127.0.0.1"
PORT = 8000

class QuietSimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler serving the web/ directory with clean logging."""
    
    def __init__(self, *args, **kwargs):
        web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
        super().__init__(*args, directory=web_dir, **kwargs)

    def log_message(self, format, *args):
        # Keep server output clean unless an error occurs
        if sys.stderr.isatty() and int(args[1]) >= 400:
            super().log_message(format, *args)


class ReusableTCPServer(socketserver.TCPServer):
    """TCP server that allows immediate address reuse."""
    allow_reuse_address = True
    daemon_threads = True


def start_server(host: str = HOST, port: int = PORT) -> None:
    """Starts the local web server and handles graceful termination."""
    web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
    if not os.path.exists(web_dir):
        print(f"Error: Directory '{web_dir}' not found.", file=sys.stderr)
        sys.exit(1)

    try:
        with ReusableTCPServer((host, port), QuietSimpleHTTPRequestHandler) as httpd:
            print("\nCritter Bonk server running at:\n", flush=True)
            print(f"http://{host}:{port}\n", flush=True)
            print("Press Ctrl+C to stop.\n", flush=True)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Critter Bonk server cleanly...", flush=True)
    except OSError as e:
        if e.errno in (98, 10048):  # Address already in use
            print(f"\nPort {port} is currently in use. Trying port {port + 1}...\n", flush=True)
            start_server(host, port + 1)
        else:
            print(f"Server error: {e}", file=sys.stderr, flush=True)
            sys.exit(1)
    finally:
        print("Server stopped. Have a bonk-tastic day!", flush=True)


if __name__ == "__main__":
    start_server()
