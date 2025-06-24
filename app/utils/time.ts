


export const calculateExpirationDate = (expireTime: string) => {
    const now = new Date();
    const amount = parseInt(expireTime.match(/^\d+/)[0]);
    const unit = expireTime.match(/[smhd]/)[0];

    switch (unit) {
      case "s":
        now.setSeconds(now.getSeconds() + amount);
        break;
      case "m":
        now.setMinutes(now.getMinutes() + amount);
        break;
      case "h":
        now.setHours(now.getHours() + amount);
        break;
      case "d":
        now.setDate(now.getDate() + amount);
        break;
      default:
        return null;
    }

    return now.toISOString(); // returns expiration in utc
  };