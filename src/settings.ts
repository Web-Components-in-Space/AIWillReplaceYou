export interface ApplicationSettings {
  "stablediffusion": {
      "uri": string;
      "steps": number;
      "sampler": string;
      "tiling": boolean;
      "width": number;
      "height": number;
      "patternWidth": number;
      "patternHeight": number;
  },
  "segmentation": {
    "cameraWidth": number;
      "cameraHeight": number;
      "interval": number;
      "drawContour": boolean;
      "blur": number;
      "foregroundThreshold": number;
  },
  "aws": {
    "bucket": string;
    "album": string;
    "region": string;
    "poolid": string;
  }
  "application": {
    "trigger": string;
  }
}


export let Settings: ApplicationSettings;

const defaultSettings = {
  "stablediffusion": {
    "uri": "http://10.116.1.15:7860/sdapi/v1/txt2img",
    "steps": 35,
    "sampler": "DDIM",
    "tiling": true,
    "width": 512,
    "height": 512,
    "patternWidth": 128,
    "patternHeight": 128,
  },
  "segmentation": {
    "cameraWidth": 1280,
    "cameraHeight": 720,
    "interval": 0,
    "blur": 10,
    "drawContour": true,
    "foregroundThreshold": 0.1
  },
  "aws": {
    "bucket": "mybucket",
    "album": "myalbum",
    "region": "us-west-1",
    "poolid": "us-west-1:somelongid"
  },
  "application": {
    "trigger": " "
  }
}

export const loadSettingsJSON = async () => {
  return await fetch('/assets/settings.json').then( (result) => {
    return result.json();
  }).then(json => {
    Settings = {
      stablediffusion: Object.assign(defaultSettings.stablediffusion, json.stablediffusion || {}),
      segmentation: Object.assign(defaultSettings.segmentation, json.segmentation || {} ),
      application: Object.assign(defaultSettings.application, json.application || {}),
      aws: Object.assign(defaultSettings.aws, json.aws || {}),
    };
    return Settings;
  })
}