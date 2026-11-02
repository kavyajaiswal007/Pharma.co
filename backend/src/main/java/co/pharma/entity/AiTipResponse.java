package co.pharma.entity;

public class AiTipResponse {
    private String title;
    private String advice;
    private String moodEmoji;
    private String warning;

    public AiTipResponse() {}

    public AiTipResponse(String title, String advice, String moodEmoji, String warning) {
        this.title = title;
        this.advice = advice;
        this.moodEmoji = moodEmoji;
        this.warning = warning;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAdvice() { return advice; }
    public void setAdvice(String advice) { this.advice = advice; }

    public String getMoodEmoji() { return moodEmoji; }
    public void setMoodEmoji(String moodEmoji) { this.moodEmoji = moodEmoji; }

    public String getWarning() { return warning; }
    public void setWarning(String warning) { this.warning = warning; }
}
