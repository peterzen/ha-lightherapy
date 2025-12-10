#!/usr/bin/with-contenv bashio

bashio::log.info "Starting Lighttherapy PoC server..."

# Run the Python server
exec /usr/bin/lighttherapy-server
