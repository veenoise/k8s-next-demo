import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({ serviceName: "k8s-next-demo" });
}
