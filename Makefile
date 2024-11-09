# Variables
SRC_DIR = src
BUILD_DIR = dist
ENTRY_FILE = $(BUILD_DIR)/index.js

# Define commands
NODE_ENV = NODE_ENV=production
PM2 = pm2
NODE = node
NPM = npm

# Default target
all: clean install build start

# Install dependencies
install:
	$(NPM) install

# Build the TypeScript code
build:
	$(NPM) run build

# Clean the build directory
clean:
	rm -rf $(BUILD_DIR)

# Run the server with pm2 if available, otherwise use node
start:
	@if command -v $(PM2) >/dev/null 2>&1; then \
		echo "Starting with PM2..."; \
		$(PM2) start $(ENTRY_FILE) --name sr-server --env production; \
	else \
		echo "Starting with Node.js..."; \
		$(NODE) $(ENTRY_FILE); \
	fi

# Stop the server if using pm2
stop:
	@if command -v $(PM2) >/dev/null 2>&1; then \
		echo "Stopping with PM2..."; \
		$(PM2) stop sr-server; \
	else \
		echo "No pm2 process to stop"; \
	fi

# Restart the server if using pm2
restart:
	@if command -v $(PM2) >/dev/null 2>&1; then \
		echo "Restarting with PM2..."; \
		$(PM2) restart sr-server; \
	else \
		echo "Use 'make start' to start the server"; \
	fi
