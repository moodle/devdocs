---
title: Moodle App Docker Images
sidebar_label: Docker images
sidebar_position: 2
tags:
  - Moodle App
  - Docker
---

[Moodle HQ](https://moodle.com/) provides a couple of Docker images that contain the Moodle App ready for use. You can search all the available versions in [Docker Hub](https://hub.docker.com/r/moodlehq/moodleapp/tags).

In order to run them, you should have [Docker](https://www.docker.com/) installed and we recommend that you have some basic understanding on how it works.

## Running the images

You can run the latest stable version of the application using the following command:

```bash
docker run --rm -p 8100:443 moodlehq/moodleapp
```

This will launch the container running the application and expose it locally on your port **8100**. You should be able to open it on `https://localhost:8100`.

If you want to use a specific version, you can do it using the tag with the release number:

```bash
docker run --rm -p 8100:443 moodlehq/moodleapp:4.4.0
```

You can also use the development version using the `next` tag:

```bash
docker run --rm -p 8100:443 moodlehq/moodleapp:next
```

## Using a specific environment

By default, the application will be launched on a __production__ environment. If you only want to use the application, that will suffice. But if you are trying to debug or run some tests it may not work.

You can use images on different environments by adding their short name as a suffix. The available environments are __production__ (no suffix), __development__ (`-dev` suffix) and __testing__ (`-test` suffix):

```bash title="Using the latest stable version"
docker run --rm -p 8100:443 moodlehq/moodleapp:latest-test
docker run --rm -p 8100:443 moodlehq/moodleapp:latest-dev
```

```bash title="Using a specific version"
docker run --rm -p 8100:443 moodlehq/moodleapp:4.0.0-test
docker run --rm -p 8100:443 moodlehq/moodleapp:4.0.0-dev
```

```bash title="Using the latest development version"
docker run --rm -p 8100:443 moodlehq/moodleapp:next-test
docker run --rm -p 8100:443 moodlehq/moodleapp:next-dev
```

## Using old versions

Before version 4.4.0, images didn't run on a secure context, so you'd need to access them on `http://localhost:8100` and expose port `80` instead:

```bash
docker run --rm -p 8100:80 moodlehq/moodleapp:4.3.0
```
