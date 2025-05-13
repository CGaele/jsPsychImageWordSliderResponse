////// A jsPsych plugin for collecting responses to image–word pairs using a slider scale.

// Created by Claudia Gaele
// Based on Josh de Leeuw's jsPsychImageSliderResponse plugin (see https://www.jspsych.org/v7/plugins/image-slider-response/) and Daiichiro Kuroki's jsPsychSurveyImageLikert plugin (see github.com/kurokida/jsPsychSurveyImageLikert/tree/main)


var jsPsychImageWordSliderResponse = (function (jspsych) {
    'use strict';


    // Define parameters
    const info = {
        name: "image-word-slider-response",
        version: "1.0.0",
        data: {
            rt: {
                type: jspsych.ParameterType.INT
            },
            response: {
                type: jspsych.ParameterType.INT,
            },
            stimulus_image: {
                type: jspsych.ParameterType.IMAGE,
            },
            stimulus_word: {
                type: jspsych.ParameterType.HTML_STRING,
            },
            slider_start: {
                type: jspsych.ParameterType.INT
            }
        },
        parameters: {
            stimulus_image: {
                type: jspsych.ParameterType.IMAGE,
                pretty_name: "Stimulus_Image",
                default: undefined,
            },
            stimulus_word: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Stimulus_Word",
                default: undefined,
            },
            stimulus_font_size: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Stimulus Font Size',
                default: '35px',
                description: 'CSS font size for the word stimulus.'
            },
            image_preamble: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Image Preamble",
                default: null,
            },
            image_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Image width',
                default: 700,
                description: 'Width of the image in pixels.'
            },
            scale_height: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Scale height',
                default: 150,
                description: 'Height of the scale container in pixels.'
            },
            questions: {
                type: jspsych.ParameterType.COMPLEX,
                array: true,
                pretty_name: "Questions",
                nested: {
                    prompt: {
                        type: jspsych.ParameterType.HTML_STRING,
                        pretty_name: "Prompt",
                        default: undefined,
                    },
                    min: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Min Value",
                        default: 0,
                    },
                    max: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Max Value",
                        default: 100,
                    },
                    step: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Step",
                        default: 1,
                    },
                    required: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "Required",
                        default: true,
                    },
                    name: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "Question Name",
                        default: "",
                    },
                },
            },
            leftmost_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Leftmost Label",
                default: "",
            },
            rightmost_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Rightmost Label",
                default: "",
            },
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button label",
                default: "Submit response",
            },
        },
    };


    // Link to jsPsych
    class ImageWordSliderResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        // Define trial elements
        trial(display_element, trial, on_load) {
            let html = `<div style="display: flex; flex-direction: column; align-items: center; text-align: center;">`;

            if (trial.image_preamble !== null) {
                html += `<div>${trial.image_preamble}</div>`;
            }

            // Create container for the stimuli
            html += `<div class='image-word-container' style='display: flex; justify-content: center; align-items: center; width: 1000px; margin-top: 100px'>`;
            // Stimulus: image
            html += `<div class='box1' style='width: 50%; justify-content: center; align-items: center; height: 100%;'>`;
            html += `<img src='${trial.stimulus_image}' style='max-width: 500px; max-height: 500px; object-fit: contain;'>`;
            html += `</div>`;
            // Stimulus: word
            html += `<div class='box2' style='width: 50%; flex: 1; justify-content: center; align-items: center; font-size:${trial.stimulus_font_size}; font-weight: bold; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>`;
            html += `${trial.stimulus_word}</div>`;
            // Close container
            html += `</div>`;


            // Create container for the slider       
            html += `<div class='slider-container' style='height: 70px;display: flex; width: 100%; justify-content: center; align-items: center;white-space: nowrap; overflow: hidden;'>`;
            for (let i = 0; i < trial.questions.length; i++) {
                let question = trial.questions[i];
                html += `<label>${question.prompt}</label>`;
                // Wrapper for the slider and the labels
                html += `<div style="position: relative; width: 700px;">`;
                // Slider
                html += `<input type='range' id='slider-${i}' min='${question.min}' max='${question.max}' step='${question.step}' value='50' required='${question.required}' style='width: 100%; accent-color:rgb(10, 171, 216);'>`;
                // Labels
                let label_width_perc = 100; //in%
                // Leftmost label
                let leftmostLabel = trial.leftmost_label ? trial.leftmost_label : "";
                html += `<div style="border: 1px solid transparent; margin-top: 20px; display: inline-block; position: absolute; left: calc(0% - (${label_width_perc}% / 2)); text-align: center; width: ${label_width_perc}%;"><span style="font-size: 20px;">${leftmostLabel}</span></div>`;
                // Rightmost label
                let rightmostLabel = trial.rightmost_label ? trial.rightmost_label : "";
                html += `<div style="border: 1px solid transparent; margin-top: 20px; display: inline-block; position: absolute; left: calc(100% - ${label_width_perc}% + (${label_width_perc}% / 2)); text-align: center; width: ${label_width_perc}%;"><span style="font-size:20px ;">${rightmostLabel}</span></div>`; html += `</div>`;
                // Value: If you don't want to display the selected value, comment out the lines below.
                html += `<span id='slider-value-${i}' style="position: absolute; bottom: 190px; font-size: 18px;color:rgb(10, 171, 216)"></span>`;
                html += `<br>`;
            }
            html += `</div>`;

            // Add submit button
            html += `<form id="jspsych-image-word-slider-form">`;
            html += `<button id='submit-button' class='jspsych-btn' style='margin-top: 25px;'>${trial.button_label}</button>`;
            html += `</form>`;

            display_element.innerHTML = html;

            // Attach slider value
            for (let i = 0; i < trial.questions.length; i++) {
                let slider = document.getElementById(`slider-${i}`);
                let valueDisplay = document.getElementById(`slider-value-${i}`);
                if (slider && valueDisplay) {
                    valueDisplay.textContent = slider.value; // Set initial value
                    slider.addEventListener('input', function () {
                        valueDisplay.textContent = slider.value;
                    });
                }
            }

            // After submit button is clicked:

            const start_time = performance.now();

            document.getElementById('submit-button').addEventListener('click', function (e) {
                e.preventDefault();
            
                const end_time = performance.now();
                const rt = Math.round(end_time - start_time);
            
                let response_values = []; // Initialize the response_values array here
                let question_numbers = []; // Get the question number separately from the value
            
                // Analyse responses for question number and slider value
                for (let i = 0; i < trial.questions.length; i++) {
                    let slider = document.getElementById(`slider-${i}`);
                    let question = trial.questions[i];
                    // Store the question number and value
                    question_numbers.push(i + 1); // question numbers
                    response_values.push(Number(slider.value)); // value as a number (no brackets)
                }
            
                let trial_data = {
                    rt: rt,
                    question_numbers: question_numbers,  
                    response_values: response_values, 
                    stimulus_image: trial.stimulus_image,
                    stimulus_word: trial.stimulus_word,
                };
            
                console.log("Trial Data:", trial_data); // comment out if not testing
                display_element.innerHTML = "";
                jsPsych.finishTrial(trial_data);
            });

            // Call the onload function
            if (typeof on_load === 'function') {
                on_load();
            }
        }

        // Simulation modes: see https://www.jspsych.org/v7/overview/simulation/ for guidance

        simulate(trial, simulation_mode, simulation_options, load_callback) {
            if (simulation_mode === "data-only") {
                load_callback();
                this.simulate_data_only(trial, simulation_options);
            } else if (simulation_mode === "visual") {
                this.simulate_visual(trial, simulation_options, load_callback);
            }
        }

        create_simulation_data(trial, simulation_options) {
            const response_data = {};
            let rt = 1000; // Base RT

            for (let i = 0; i < trial.questions.length; i++) {
                const q = trial.questions[i];
                // Note: Question numbers won't save with 'Q', only the number. E.g.: '1' instead of 'Q1'.
                const simulated_value = this.jsPsych.randomization.randomInt(q.min, q.max);
                response_data[q.name] = simulated_value;
                rt += this.jsPsych.randomization.sampleExGaussian(1500, 400, 1 / 200, true);
            }

            const default_data = {
                response: response_data,
                stimulus_image: trial.stimulus_image,
                stimulus_word: trial.stimulus_word,
                rt: rt,
            };

            const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
            this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
            return data;
        }

        simulate_data_only(trial, simulation_options) {
            const data = this.create_simulation_data(trial, simulation_options);
            this.jsPsych.finishTrial(data);
        }

        simulate_visual(trial, simulation_options, load_callback) {
            const data = this.create_simulation_data(trial, simulation_options);
            const display_element = this.jsPsych.getDisplayElement();

            this.trial(display_element, trial, () => {
                load_callback();

                const response_entries = Object.entries(data.response);
                for (let i = 0; i < response_entries.length; i++) {
                    const [question_name, value] = response_entries[i];
                    const slider = display_element.querySelector(`#slider-${i}`);
                    if (slider) {
                        slider.value = value;
                        slider.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#submit-button"), data.rt);
            });
        }
    };

    ImageWordSliderResponsePlugin.info = info;

    return ImageWordSliderResponsePlugin;
})(jsPsychModule);
