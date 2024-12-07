import {FlowModule} from "flow-sdk";

const flowModule = new FlowModule('https://flow.info');

const response = await flowModule.sendBotNotifications('bot_id','rcvr_user_id', '안녕', 'CNTS_CRTC_KEY');

console.log(response);