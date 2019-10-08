import { RateLimiter } from "./rateLimiter";

test("rate limits correctly", async () => {
    const rateLimiter = new RateLimiter();
    const t1 = Date.now();
    await rateLimiter.wait();
    const t2 = Date.now();
    await rateLimiter.wait();
    const t3 = Date.now();

    expect(t2 - t1).toBeLessThan(100);
    expect(t3 - t2).toBeGreaterThanOrEqual(1000);
});
