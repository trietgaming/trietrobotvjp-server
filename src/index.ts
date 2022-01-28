import cors from "fastify-cors";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import { ClientCallException } from "./interfaces";
import Fastify from "fastify";

process.env.PRIVATE_KEY = (process.env.PRIVATE_KEY as string).replace(
  /\\n/g,
  "\n"
);

if (process.env.NODE_ENV === "production") console.log = () => undefined;

const main = async () => {
  const isDev = process.env.NODE_ENV === "development";
  const fastify = Fastify({
    ...(isDev
      ? {
          http2: true,
          https: {
            allowHTTP1: true,
            cert: "-----BEGIN CERTIFICATE-----\nMIIEDTCCAnWgAwIBAgIRAOOd8ycpncxC3W35iec2DBowDQYJKoZIhvcNAQELBQAw\nXzEeMBwGA1UEChMVbWtjZXJ0IGRldmVsb3BtZW50IENBMRowGAYDVQQLDBFUUklF\nVFxUcmlldEBUcmlldDEhMB8GA1UEAwwYbWtjZXJ0IFRSSUVUXFRyaWV0QFRyaWV0\nMB4XDTIxMTAxODEzNDg0MVoXDTI0MDExODEzNDg0MVowRTEnMCUGA1UEChMebWtj\nZXJ0IGRldmVsb3BtZW50IGNlcnRpZmljYXRlMRowGAYDVQQLDBFUUklFVFxUcmll\ndEBUcmlldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMEF8hoyzHiI\nq2MGosCcSNYybKZrRH1znPt+RcW6IKrEjYR7Bbsk2n5Y7PiFBC2Wmkf40osyVvuO\nqOI3APN2I/pKLcfsm/OxtFXi9btXVAAYFKs7JxM8n7dKzLp9a/zXcUMxWu7gndu1\nzr6267AjEjplrcvJQEQlIkLxvbj5uLzEV8Fgi5oYJVamnVaOWDxmLUq1JsKqjtyX\ntVtWXsM+PFCPmuokpnlRaAcRAE7MrYz6T0scC3L7WPQGJngu/4wHQxmxDfvRfYaW\nwGxsMdR8gYVDZQ9Mx8gxvdyCIRoBpuJiO1D5HVHMVZn74N5IKiC1wRw76Zoh8sgh\n/lW59+3IXosCAwEAAaNeMFwwDgYDVR0PAQH/BAQDAgWgMBMGA1UdJQQMMAoGCCsG\nAQUFBwMBMB8GA1UdIwQYMBaAFCxCBqcm+5pxBzUz/0bMxNISk266MBQGA1UdEQQN\nMAuCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAYEAbbxl/6gqnXB1SpLH3XUP\nv2Ii+r9fN0OHuhLrGXCDr0gYAkfajP1Y79rWkmvGKjhAgpaGrRBVswjMO/+SrCJy\nBC0Z5iMHR3En+RGX7JKN0O1OQGx/u7KOizhjtNCumonR0N/A5qJBZ8fRsFxbrLxa\nICk8MnFpoal28UpP1FtF+hYDmlIPIwUWwTEPEk5ON5Eb8pxx/TD729moL0XFvPD0\nB3jU2dsYKIlup5OXIv1VOQrgPVIOITyXZFJDldJkpeWzILD1IUfDalUBAI7mq27b\nydgDb48BARy4Sx79imYP99RsJv0XnbczqPNa4SxB4UbvT96p7gI4fxzogjxlNI+I\nwDX/PYEmIgLIUbTIAwnUW4sTDkt20r/s4wHn+Zl7cDyO2j3Re6vsZqCcux1m3GYq\nX5+CwegNRiPU7wQ15KvbRV5YhCUtmlQCIhU3pjrE0fMUfkKfBUXoiFSFCRnvhOpl\ndH2yYjV0S+YrfKlnjsfBEG8r1QvDkwzf9DN0qyMqTUZ5\n-----END CERTIFICATE-----",
            key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBBfIaMsx4iKtj\nBqLAnEjWMmyma0R9c5z7fkXFuiCqxI2EewW7JNp+WOz4hQQtlppH+NKLMlb7jqji\nNwDzdiP6Si3H7JvzsbRV4vW7V1QAGBSrOycTPJ+3Ssy6fWv813FDMVru4J3btc6+\ntuuwIxI6Za3LyUBEJSJC8b24+bi8xFfBYIuaGCVWpp1Wjlg8Zi1KtSbCqo7cl7Vb\nVl7DPjxQj5rqJKZ5UWgHEQBOzK2M+k9LHAty+1j0BiZ4Lv+MB0MZsQ370X2GlsBs\nbDHUfIGFQ2UPTMfIMb3cgiEaAabiYjtQ+R1RzFWZ++DeSCogtcEcO+maIfLIIf5V\nufftyF6LAgMBAAECggEAAjD3FqUM/TFQAMfKgTVE/mmEIj+Ff4cYeSJt2FjMliO1\nF5Pt9LnuYRDRX+Dis0HKbpa8jSf9JM3xzN+i+yCUN/svmd1tx850paT19TKAmZ+s\nXGVHhEhj58jJmjRiTXSErKaayatzH1NpDXE2K8G6Kz+MQYv/Vsa1JN1psffjyQDM\nkBfdng5WbKmrLN5t3MT5st2MAKOKnaYLhVxW80dLtv4yHrTHcH2BD1l3S2KvZLHK\nawJKnMgqDj3hsXHdQ8KZ39/FkMeg8WU7qg+HKpHsfuGUXHj2Cxhvr0F+v/qgT8/z\n33PmSjbrDVNQ+Shf+D8lqWHWwsn+l5pEG0/ZLw5dwQKBgQDSDj8dp6XdDwfa1X0B\nZBtubEsk9nlh8itV9pi+usPSEGODr/ocEM3NhHknEIkrROdk69tnEEoqPpWjeNbQ\n349L5E4t9yYA55yyoVPaMrOtiM8hJz8LyhIe3d4loYkk6As/4T/A8JvgmyO0MEEr\nvvT/hYW/eHCPEKApcRKkizZM/wKBgQDrPf5uqYQCbiAxHWs8+FkJPwSMDmncraMG\nIrljmvlilNkgjSArAPau3JAOoK3oWC6/biXvBuXiLpRRrkrc6RLuGUr7Wvf4I7vA\n9gooHUfF8hsQRpD/agBiip8pwlHeuu/dXIiW1cNKPre6R7bHHT1Yze/r+uU3H9Bi\nHRlkRzLSdQKBgBj31IzD1rVWCgr7AWbe7VvMx4nXOkpoLLqFG1bggFJB3HJUwpf/\nb1cUfgokrwlToWWfm26+wvIOil7qCC6/xBqzQo+4Ju5ImZmqD3uKN01TS7uXHKlc\nFZdRrAwxDUozwtKPBbL7ZqvmBPJwIe7/PcP5rRI7ULXQthj29c5VNdklAoGBAIMe\nhd/Gqqb0HQtjO2+7eV02++DY89amDdUQq8bCDbkOAEwtfT2bBuSGWeFdXDHCXSQk\nUA6ACMhecBtrC51AaGXAQVQC624q9K7kNNsRHv1NKhqTSqSiv94tJ/QNtLZx+dqn\nhhaUxYpvlNbGvDEVsij6eH1O1k44dF0LnSiQqto1AoGAZvNkDJrqP/aZEoB+bw+Q\ndQnnVBfCLvOwhlzVBJ6d56fy2etstahPWRsRW0AyYzqy/71Ybt5ZsOJCYpPb+300\nBwBuD2MVVvXRKs046VsZ+88lzj69wdoYdRVhIvvoac6Uh4HjTnhXmedsvE8FfuVE\nxQOws9iegTADyjysKrU+6c4=\n-----END PRIVATE KEY-----",
          },
          logger: true,
        }
      : {}),
  });

  fastify.register(cors, { origin: process.env.CLIENT_DOMAIN as string });

  fastify.get("/", async (req, res) => true);

  fastify.register(usersRouter, { prefix: "/users/:uid" });
  fastify.register(authRouter, { prefix: "/auth" });

  console.log(process.env.NODE_ENV);

  const network = await fastify.listen(
    +(process.env.PORT as string),
    "0.0.0.0"
  );
  console.warn(
    `App is listening at ${process.env.DOMAIN}:${process.env.PORT}; ${network}`
  );
};

main().catch((err) => {
  console.error(err);
});
