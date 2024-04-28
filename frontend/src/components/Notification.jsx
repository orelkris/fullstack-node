export const NotificationType = {
  SUCCESS: "success",
  FAIL: "fail",
};

const Notification = ({ message, type }) => {
  return (
    <div
      className={`${
        type === NotificationType.SUCCESS ? "success" : "fail"
      } notification`}
    >
      {message}
    </div>
  );
};

export default Notification;
