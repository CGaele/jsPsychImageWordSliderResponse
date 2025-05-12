# jsPsychImageWordSliderResponse

This plugin is based on Josh de Leeuw's [jsPsychHtmlSliderResponse](www.jspsych.org/v7/plugins/html-slider-response/) plugin and Daiichiro Kuroki's [jsPsychSurveyImageLikert](github.com/kurokida/jsPsychSurveyImageLikert/tree/main) plugin.    
  
<br>

**Description:**

A jsPsych plugin for collecting responses to image–word pairs using a slider. It displays an image on the left, a word on the right, and a slider scale below them. See the example below.

<img width="1512" alt="Screenshot 2025-05-12 at 17 55 30" src="https://github.com/user-attachments/assets/dbfd902e-22c1-4be4-86fa-487099fff776" />
  
**Parameters:**

- stimulus_image
- stimulus_word
- stimulus_font_size
- image_preamble
- image_width
- scale_height
- questions (prompt, min, max, step, required, name)
- leftmost_label
- rightmost_label
- button_label

<br>

**Demo code**
```html
<!DOCTYPE html>
<html>

<head>
  <title>Demo of Image Word Slider Response plugin</title>
  <script src="jspsych/jspsych.js"></script>
  <script src="jspsych/plugin-image-word-slider-response.js"></script>
</head>

<body></body>
<script>

  var jsPsych = initJsPsych({
  });

  var timeline = [];


  var demo = {
    type: jsPsychImageWordSliderResponse,
    stimulus_image: 'lemur.jpeg',
    stimulus_word: 'LEMUR',
    stimulus_font_size: '50px',
    response_ends_trial: true,
    post_trial_gap: 500,
    questions: [{
      min: 0,
      max: 100,
      prompt: ''
    }],
    leftmost_label: '<strong>Innocent fluffball</strong>',
    rightmost_label: '<strong>Banana bandit!</strong>',
  };
  timeline.push(demo)

  jsPsych.run(timeline);

</script>

</html>
```
