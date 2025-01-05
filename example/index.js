import {FlowModule} from "flow-sdk";

const flowModule = new FlowModule('https://flow.info', 'content-key');

const response = await flowModule.sendBotNotifications('bot_id','rcvr_user_id', '안녕');

console.log(response);