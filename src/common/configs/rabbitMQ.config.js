import amqp from 'amqplib';
import { StatusCodes } from 'http-status-codes';
import {
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_USER,
  RABBITMQ_PASS,
} from './config.js';

export const sendMessage = async (key, payload) => {
  try {
    const connection = await amqp.connect(
      `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`
    );
    const channel = await connection.createChannel();

    connection.on('error', (err) => {
      console.log('Error: ', err);
    });

    await channel.assertQueue(key, {
      durable: true,
    });

    channel.sendToQueue(key, Buffer.from(payload), {
      persistent: true,
    });

    console.log(`[x] Sent '${payload}'`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error('Error sending message:', err);
    let error = new Error('메시지 전송에 실패하였습니다.');
    error.StatusCodes = StatusCodes.NOT_FOUND;
    throw error;
  }
};

export const consumerMessage = async (key) => {
  try {
    const connection = await amqp.connect('amqp://root:root@localhost:5672');
    const channel = await connection.createChannel();

    connection.on('error', (err) => {
      console.log('Error: ', err);
    });

    const messageArray = [];
    await channel.consume(key, async (payload) => {
      const parse = String(payload.content);

      // RabbitMQ로 받은 데이터 배열에 저장
      messageArray.push(parse);

      // 데이터 정상 수신을 RabbitMQ에게 알린 후, 데이터들을 지움
      channel.ack(payload);
    });

    setTimeout(() => {
      connection.close();
    }, 500);

    return messageArray;
  } catch (error) {
    if (error.code === StatusCodes.NOT_FOUND) {
      let error = new Error('해당 Queue는 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }
  }
};
