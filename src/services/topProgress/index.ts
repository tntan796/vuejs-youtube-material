import { sleep } from "@/extras/sleep";

class TopProgressWrapper {
  private asyncInstance = import(/* webpackChunkName: "Toprogress" */ "toprogress2").then(
    async module => {
      let instance = new module.ToProgress({
        color: "#ffffff",
        height: "2px",
        duration: 0.2,
        position: "top",
        selector: "body"
      });

      let elem: HTMLDivElement = (instance as any).element;
      elem.style.zIndex = "99999999999999";

      await sleep();
      return instance;
    }
  );
  private noOfPendingRequests = 0;

  async startAuto(promise: Promise<any>) {
    let instance = await this.asyncInstance;

    if (!this.noOfPendingRequests) {
      if (!this.noOfPendingRequests) {
        let raceResult = await Promise.race([
          promise.then(_ => "noop"),
          sleep(50).then(_ => "op")
        ]);

        if (raceResult === "noop") {
          return;
        }
      }

      instance.start(10);
    }

    this.noOfPendingRequests++;

    promise
      .then(async () => {
        this.noOfPendingRequests--;

        await sleep(100);
        if (!this.noOfPendingRequests) {
          instance.finish();
        }
      })
      .catch(() => {
        this.noOfPendingRequests = 0;
        instance.reset();
      });
  }
}

export const TopProgress = new TopProgressWrapper();
