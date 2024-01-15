import axios from "axios";
import * as querystring from "querystring";

export class SMS {
  readonly data: { username: string; password: string };

  constructor(username: string, password: string) {
    this.data = {
      username,
      password,
    };
  }

  async request(method: string, params: object): Promise<string> {
    const postdata = querystring.stringify({ ...this.data, ...params });
    return await axios
      .post(`https://rest.payamak-panel.com/api/SendSMS/${method}`, postdata, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Content-Length": postdata.length.toString(),
        },
      })
      .then(async (res) => {
        const status = res.status;
        if (status !== 200) throw new Error(await res.data());
        return await res.data();
      })
      .then((body) => {
        if (typeof body !== "string") throw new Error("Invalid response");
        return body as string;
      })
      .catch((e) => {
        return e.message;
      });
  }

  send(to: string, from: string, text: string, isFlash: boolean = false) {
    return this.request("SendSMS", {
      to,
      from,
      text,
      isFlash,
    });
  }

  sendByBaseNumber(text: string, to: string, bodyId: string) {
    return this.request("BaseServiceNumber", {
      text,
      to,
      bodyId,
    });
  }

  isDelivered(recId: string) {
    return this.request("GetDeliveries2", {
      recId,
    });
  }

  getMessages(location: string, index: string, count: string) {
    return this.request("GetMessages", {
      location,
      index,
      count,
    });
  }

  getCredit() {
    return this.request("GetCredit", {});
  }

  getBasePrice() {
    return this.request("GetBasePrice", {});
  }

  getNumbers() {
    return this.request("GetUserNumbers", {});
  }
}

export default SMS;
