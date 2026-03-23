import { describe, it, expect } from "vitest";
import config from "./next-sitemap.config.js";

describe("next-sitemap.config", () => {
  it("should define a valid absolute HTTPS siteUrl", () => {
    expect(config.siteUrl).toBeDefined();
    expect(config.siteUrl).toMatch(/^https:\/\/.+/);
    expect(config.siteUrl).toBe("https://yoannlaubert.dev");
  });

  it("should enable robots.txt generation", () => {
    expect(config.generateRobotsTxt).toBe(true);
  });

  it("should exclude API routes from sitemap", () => {
    expect(config.exclude).toBeDefined();
    expect(config.exclude).toContain("/api/**");
  });

  it("should allow all crawlers in robots.txt policies", () => {
    expect(config.robotsTxtOptions).toBeDefined();
    expect(config.robotsTxtOptions.policies).toBeDefined();

    const allPolicy = config.robotsTxtOptions.policies.find(
      (p: { userAgent: string; allow: string }) => p.userAgent === "*"
    );
    expect(allPolicy).toBeDefined();
    expect(allPolicy!.allow).toBe("/");
    expect(allPolicy!.disallow).toContain("/api/");
  });

  it("should set changefreq and priority defaults", () => {
    expect(config.changefreq).toBe("monthly");
    expect(config.priority).toBe(0.7);
  });
});
