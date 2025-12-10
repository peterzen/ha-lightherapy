ARG BUILD_FROM
FROM $BUILD_FROM

# Install Python 3
RUN apk add --no-cache python3

# Copy data and server
COPY data /data
COPY rootfs /

# Make server executable
RUN chmod a+x /usr/bin/lighttherapy-server

# Run script
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
