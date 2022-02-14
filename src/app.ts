/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { IClientOptions, Client, connect, IConnackPacket } from "mqtt";

const fetch = require('node-fetch');

const DEBUG = true;

/**
 * The main class of this app. All the logic goes here.
 */
 export default class MQTTGauge {

    private gaugeBody: MRE.Actor = null;
    private pointer: MRE.Actor = null;
    private anim_pointer: MRE.Actor = null;
    private assets: MRE.AssetContainer;
    private BROKER: string;
	private TOPIC: string;
	private client: Client;

	private valueWind: number = null; // value used to move the pointer

    
    constructor(private context: MRE.Context, private params: MRE.ParameterSet, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }

    /*
    * Once the context is "started", initialize the app.
    */
    private  started() {
    
        // set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
        this.assets = new MRE.AssetContainer(this.context);

        this.gaugeBody = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1846572962480653129',
            actor:{
                name:'Gauge',
                transform: {
                    local: {
                        position: { x: 1, y: 0, z: 0 },
                        rotation:{ x: 0, y: 0, z: 0 },
                    }
                }
            }
        })


        this.anim_pointer = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1934780716193677910',
            actor:{
                name:'Anim Pointer',
                parentId: this.gaugeBody.id,
                transform: {
                    local: {
                        position: { x: 10, y: 5, z: 0 },
                        rotation:{ x: 0, y: 0, z: 0 },
                        scale:{ x: 0.02, y: 0.02, z: 0.02 },
                    }
                }
            }
        })


        for (let i = 0; i < 10; i++) {
            this.pointer = MRE.Actor.CreateFromLibrary(this.context, {
                resourceId: 'artifact:1934780705447871049',
                actor:{
                    name:'Gauge Pointer',
                    parentId: this.gaugeBody.id,
                    transform: {
                        local: {
                            position: { x: 0, y: 5*i, z: 0 },
                            rotation:{ x: 0, y: 0, z: 0 },
                            scale:{ x: 0.02, y: 0.02, z: 0.02 },
                        }
                    }
                }
            })
        }

        MRE.Animation.AnimateTo(this.context, this.anim_pointer, {
            destination:
              {
                transform:
                {
                  local:
                  {
                  //rotation from 0 to 270dg->[3(Math.PI)/2]->4.712. Value to multiply 4.721/60->0.07853
                  rotation: MRE.Quaternion.FromEulerAngles(0, 180 * ((3 * (Math.PI) / 2) / 60), 0)
                  }
                }
              },
                duration: 60.5,
                easing: MRE.AnimationEaseCurves.EaseOutSine
            });
    

       

    }

 }
