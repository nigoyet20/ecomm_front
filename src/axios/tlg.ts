import axios from "axios";

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TLG_BOT; 
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TLG_CHANNEL;

const sendDocToTelegram = async (doc: File) => {
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("document", doc);

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    } catch (error) {
        console.error(error);
        alert(error)
    }
};

const sendMessageToTelegram = async (message: string) => {
  const formData = new FormData();
  formData.append("chat_id", TELEGRAM_CHAT_ID);
  formData.append("text", message);  // Ajouter le texte du message

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    alert(error)
    console.error(error);
  }
};


export { sendDocToTelegram, sendMessageToTelegram };
