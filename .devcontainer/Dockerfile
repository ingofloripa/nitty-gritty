FROM node:20-bookworm-slim
RUN apt-get update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y install git
CMD ["bin/bash"]
