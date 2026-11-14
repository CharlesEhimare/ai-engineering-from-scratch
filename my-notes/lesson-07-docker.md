# Lesson 7: Docker for AI

- Docker = client (docker command) + daemon (Docker Desktop). "failed to connect to the docker API" means Docker Desktop isn't running
- hello-world pulled the arm64 image automatically for the M4
- Built my own image (python:3.12-slim + CPU torch + numpy + flask); containers run Linux aarch64 even on a Mac
- Layer caching: rebuild with no changes 0.3 s; adding flask only rebuilt that layer (1.8 s total)
- Volumes (-v): container read my Mac files and wrote a file that survived after the container was deleted
- Sizes: full python:3.12 = 419 MB download; my slim image WITH PyTorch = 288 MB. Smaller image = smaller attack surface
- Flask API in a container, port mapped with -p 5001:5000 (Mac port 5000 is used by AirPlay); app must listen on 0.0.0.0
- Skipped the course's CUDA Dockerfile: no NVIDIA GPU on a Mac (the lesson says so)
