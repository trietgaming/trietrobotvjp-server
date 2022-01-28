import { FastifyError, FastifyRequest, FastifyReply } from "fastify";

const withCodeRoutersErrorHandler = async (
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  console.log("error handler");
  return reply.redirect(
    `${process.env.CLIENT_DOMAIN as string}/account?error=${error?.code}`
  );
};
export default withCodeRoutersErrorHandler;
