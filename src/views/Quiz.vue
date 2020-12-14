<template>
	<section class="quiz">
		<!-- RESULT -->
		<div v-if="finished" class="results">
			<h3>🎉 Hooray!</h3>
			<p>Your score: {{ score }} / 10</p>
			<p>You needed {{ elapsed }}s to complete</p>
			<p>
				<button @click="reset">Try again</button>
			</p>
		</div>

		<!-- QUIZ -->
		<div v-else-if="started" class="question">
			<h3>{{ question.question }}</h3>
			<ul class="answers">
				<li v-for="answer in question.answers" :key="answer">
					<label :class="answerClass(question, answer)">
						<input v-model="step.answer" :value="answer" type="radio">
						<img v-if="isUrl(answer)" :src="answer">
						<span v-else>{{ answer }}</span>
					</label>
				</li>
			</ul>
			<progress
				:max="config.COUNTDOWN[selectedLevel]"
				:value="countdown"
				:class="`hurry-${hurryLevel}`" />
		</div>

		<!-- CONFIG -->
		<div v-else class="config">
			<h1>Quiz</h1>
			<fieldset class="selector selector--level">
				<legend>Selecciona el teu nivell</legend>
				<label v-for="level in levels" :key="level">
					<input v-model="selectedLevel" :value="level" type="radio">
					<span :class="`selector__${level}`">
						{{ level }}
					</span>
				</label>
			</fieldset>
			<fieldset class="selector selector--topic">
				<legend>Selecciona les temàtiques</legend>
				<label v-for="topic in topics" :key="topic">
					<input v-model="selectedTopic" :value="topic" type="checkbox">
					<span :class="`selector__${topic}`">
						{{ topic }}
					</span>
				</label>
			</fieldset>
			<button @click="start">Començar</button>
		</div>
	</section>
</template>

<script>
import { quiz as config } from '../config.yaml';
import questions from '../assets/quiz_questions.yaml';
import { shuffle } from '../utils/utils.array';

export default {
	name: 'Quiz',
	data() {
		return {
			config,
			levels: config.levels,
			topics: config.topics,
			selectedLevel: undefined,
			selectedTopic: [],
			started: false,
			finished: false,
			step: undefined,
			score: 0,
			elapsed: 0,
			countdown: undefined,
			interval: undefined,
		};
	},
	computed: {
		questions() {
			if (!this.selectedLevel || !this.selectedTopic.length) return [];
			const filter = ({ level, topic }) => level === this.selectedLevel && this.selectedTopic.includes(topic);
			return shuffle(questions.filter(filter)).slice(0, config.QUESTION_COUNT);
		},
		question() {
			if (!this.step) return undefined;
			const { question, invalid, valid, hint } = this.questions[this.step.index];
			const answers = shuffle([...shuffle(invalid).slice(0, config.ANSWER_COUNT - 1), valid]);
			return { question, answers, valid, hint };
		},
		hurryLevel() {
			return Math.ceil(((this.countdown * 100) / config.COUNTDOWN[this.selectedLevel]) / 25);
		},
	},
	watch: {
		'step.answer': function answerChange(answer) {
			if (answer !== undefined) this.resolve();
		},
		countdown(countdown) {
			if (countdown <= 0) this.resolve();
		},
	},
	methods: {
		reset() {
			this.score = 0;
			this.step = undefined;
			this.finished = false;
			this.started = false;
			this.elapsed = 0;
			this.selectedLevel = undefined;
			this.selectedTopic = [];
		},
		start() {
			if (this.selectedLevel && this.selectedTopic.length) {
				this.score = 0;
				this.finished = false;
				this.started = true;
				this.elapsed = 0;
				this.next(0);
			}
		},
		resolve() {
			const { valid } = this.question;
			const { hinted, answer, index } = this.step;
			this.score += answer === valid ? hinted ? config.HINT_SCORE : 1 : 0;
			this.elapsed += config.COUNTDOWN[this.selectedLevel] - this.countdown;
			clearInterval(this.interval);
			setTimeout(() => {
				this.next(index + 1);
			}, config.VALIDATION_TIME * 1000);
		},
		next(index) {
			if (index === this.questions.length) this.finished = true;
			else {
				this.step = { answer: undefined, hinter: false, index };
				this.countdown = config.COUNTDOWN[this.selectedLevel];
				this.interval = setInterval(() => {
					this.countdown -= config.STEPDOWN;
				}, config.STEPDOWN * 1000);
			}
		},
		answerClass({ valid }, answer) {
			return ['answer', {
				'is-resolved': this.step.answer !== undefined || this.countdown <= 0,
				'is-valid': answer === valid,
				'is-invalid': answer !== valid,
			}];
		},
		isUrl(string) {
			return string.match('http');
		},
	},
};
</script>
