"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
const mqtt_1 = require("mqtt");
const fetch = require('node-fetch');
const DEBUG = true;
/**
 * The main class of this app. All the logic goes here.
 */
class MQTTGauge {
    constructor(context, params, baseUrl) {
        this.context = context;
        this.params = params;
        this.baseUrl = baseUrl;
        this.gaugeBody = null;
        this.pointer = null;
        this.anim_pointer = null;
        this.valueWind = null; // value used to move the pointer
        this.context.onStarted(() => this.started());
    }
    /*
    * Once the context is "started", initialize the app.
    */
    started() {
        // set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
        this.assets = new MRE.AssetContainer(this.context);
        this.gaugeBody = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1846572962480653129',
            actor: {
                name: 'Gauge',
                transform: {
                    local: {
                        position: { x: 1, y: 0, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                    }
                }
            }
        });
        this.anim_pointer = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1934780716193677910',
            actor: {
                name: 'Anim Pointer',
                parentId: this.gaugeBody.id,
                transform: {
                    local: {
                        position: { x: 10, y: 5, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.02, y: 0.02, z: 0.02 },
                    }
                }
            }
        });
        for (let i = 0; i < 10; i++) {
            this.pointer = MRE.Actor.CreateFromLibrary(this.context, {
                resourceId: 'artifact:1934780705447871049',
                actor: {
                    name: 'Gauge Pointer',
                    parentId: this.gaugeBody.id,
                    transform: {
                        local: {
                            position: { x: 0, y: 5 * i, z: 0 },
                            rotation: { x: 0, y: 0, z: 0 },
                            scale: { x: 0.02, y: 0.02, z: 0.02 },
                        }
                    }
                }
            });
        }
        MRE.Animation.AnimateTo(this.context, this.anim_pointer, {
            destination: {
                transform: {
                    local: {
                        //rotation from 0 to 270dg->[3(Math.PI)/2]->4.712. Value to multiply 4.721/60->0.07853
                        rotation: MRE.Quaternion.FromEulerAngles(0, 180 * ((3 * (Math.PI) / 2) / 60), 0)
                    }
                }
            },
            duration: 60.5,
            easing: MRE.AnimationEaseCurves.EaseOutSine
        });
        //this.mqttConnect();
    }
    mqttConnect() {
        console.log("ready");
        this.BROKER = "mqtt://URL OF THE MQTT BROKER";
        this.TOPIC = "TOPIC/TO/SUBSCRIBE";
        const opts = { port: 1883 };
        //username:USER, password: PW can be added in the opts
        this.client = mqtt_1.connect(this.BROKER, opts);
        this.client.subscribe({ [this.TOPIC]: { qos: 2 } }, (err, granted) => {
            granted.forEach(({ topic, qos }) => {
                console.log(`subscribed to ${topic} with qos=${qos}`);
            });
        }).on("message", (topic, payload) => {
            //if response is JSON use
            //const responseJson = JSON.parse(payload.toString());
            //if response is value use
            const responseJson = payload.toString();
            console.log(responseJson);
            this.valueWind = parseFloat(responseJson);
            //rotation from 0 to 270dg->[3(Math.PI)/2]->4.712. Value to multiply 4.721/60->0.07853
            // this.pointer.transform.local.rotation = MRE.Quaternion.FromEulerAngles(0, this.valueWind*((3*(Math.PI)/2)/60),0);
            // client.end(); //uncomment to stop after 1 msg
        }).on("connect", (packet) => {
            console.log("connected!", JSON.stringify(packet));
        });
    }
}
exports.default = MQTTGauge;
//# sourceMappingURL=app.js.map