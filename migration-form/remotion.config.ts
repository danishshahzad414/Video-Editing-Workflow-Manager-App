import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le"); // alpha channel support for ProRes 4444
Config.setCodec("prores");
Config.setProResProfile("4444"); // includes alpha channel
Config.setConcurrency(4);
