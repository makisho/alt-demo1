/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class MQTTGauge {
    private context;
    private params;
    private baseUrl;
    private gaugeBody;
    private pointer;
    private anim_pointer;
    private assets;
    private BROKER;
    private TOPIC;
    private client;
    private valueWind;
    constructor(context: MRE.Context, params: MRE.ParameterSet, baseUrl: string);
    private started;
    private mqttConnect;
}
//# sourceMappingURL=app.d.ts.map