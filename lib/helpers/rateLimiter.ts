export async function wait(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class RateLimiter {
    public lastRequestTime = 0;

    public async wait() {
        while (Date.now() - this.lastRequestTime < 1000) {
            await wait(100);
        }
        this.lastRequestTime = Date.now();
        return false;
    }
}
