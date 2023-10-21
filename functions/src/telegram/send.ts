/* eslint-disable max-len */
import {firestore} from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import {Telegraf} from "telegraf";

const TELEGRAM_TOKEN = functions.config().telegram.token;

const bot = new Telegraf(TELEGRAM_TOKEN);

bot.catch((err, ctx) => {
  logger.error("[Bot] Error", err);
  ctx.reply(`Ooops, encountered an error for ${ctx.updateType}: ${err}`, {
    reply_to_message_id: ctx.message?.message_id,
  });
});

const formatDate = (date: unknown) => {
  if (date instanceof firestore.Timestamp) {
    const d = date.toDate();
    return [`${d.getDate().toString().padStart(2, "0")}/${d.getMonth().toString().padStart(2, "0")}/${d.getFullYear()}`, `${d.getHours()}:${d.getMinutes()}`];
  }

  if (date instanceof Date) {
    return [`${date.getDate().toString().padStart(2, "0")}/${date.getMonth().toString().padStart(2, "0")}/${date.getFullYear()}`, `${date.getHours()}:${date.getMinutes()}`];
  }
  return [null, null];
};

const printMovie = (movie: unknown) => {
  if (typeof movie === "object" && movie && "imdbId" in movie && "title" in movie && "year" in movie) {
    return `- [${movie.title} (${movie.year})](https://www.imdb.com/title/${movie.imdbId})`;
  }
  throw new Error(`Invalid movie entry: ${movie}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getEventCreateMessage = (spaceId: string, data: any) => {
  const [date, hours] = formatDate(data.scheduledFor);

  return `
Hey humans!
*${data.createdBy?.name}* just created a new event!
If you're free on ${date} at ${hours}, subscribe to it on https://pencilheads.net/${spaceId}!
The movies planned are:
${Object.values(data.movies || {}).map(printMovie).join("\n")}
`;
};

type EventCreateProps = {
  telegramGroupId?: string;
  spaceId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
}

export const notifyGroupOnEventCreate = async ({telegramGroupId, spaceId, event}: EventCreateProps) => {
  if (!telegramGroupId) {
    return;
  }
  try {
    logger.log("pushing to telegram");
    await bot.telegram.sendMessage(
      telegramGroupId,
      getEventCreateMessage(spaceId, event)
    );
  } catch (err) {
    logger.error("[Bot] Error", err);
  }
};
