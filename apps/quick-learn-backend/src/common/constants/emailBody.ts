export const EMAIL_BODY = {
  DAILY_LESSON_EMAIL(
    greetingText: string,
    first_name: string,
    last_name: string,
    randomLessionToSendName: string,
    lessonURL: string,
  ) {
    return `<div>
            <p>${greetingText}, ${first_name} ${last_name} Here's your Lesson of the Day: ${randomLessionToSendName}</p><br/>
            <p>Please click on the link below to read today's lesson.</p><br/>
            <a style="padding: 8px 16px;text-decoration: none;background-color: #10182a;border-radius: 4px;color: white;" target="_blank" href="${lessonURL}">Read Lesson</a><br/><br/>
            <p>Please note: This link will expire in <b>3 hours</b>.</p>
        <div>`;
  },

  RESET_READING_HISTORY() {
    return `<div>
                <p>Congratulations !! You have read all assigned lessons, we are going to reset your reading history so that you can keep going with your learning journey.</p><br/>
              <div>`;
  },
};
