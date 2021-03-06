function AvailabilityRecurrence(el) {
  this.$el = $(el);
  this.setupRecurrence = false;
}

AvailabilityRecurrence.prototype.handleRecurrenceSetup = function(browserEvent) {
  if(this.setupRecurrence) {
    this.setupRecurrence = false;
  } else {
    this.setupRecurrence = true;
  }

  this.toggleRecurrencePattern();
}

AvailabilityRecurrence.prototype.toggleRecurrencePattern = function() {
  if(this.setupRecurrence) {
    this.$el.find(".recurrence_pattern").html(this.renderRecurrencePattern());
    this.$el.find(".recurrence_pattern").show();
  } else {
    this.$el.find(".recurrence_pattern").hide();
  }
}

AvailabilityRecurrence.prototype.renderRecurrencePattern = function() {
  function pad(n){return n<10 ? '0'+n : n}
  var template = $(this.$el.find(".template").html());
  template.find(".dates_recurring").html(this.recurrenceDatesSentence());
  template.find(".time_recurring").html(
    pad(this.availabilityTime().getHours()) + ":" + pad(this.availabilityTime().getMinutes())
  );

  return template;
}

AvailabilityRecurrence.prototype.availabilityTime = function() {
  var date = $("#availability_start_time_1s").val();
  var hour = $("#availability_start_time_4i option:selected").val();
  var minute = $("#availability_start_time_5i option:selected").val();

  return new Date(date + " " + hour + ":" + minute);
}

AvailabilityRecurrence.prototype.numberOfRecurrences = function() {
  return parseInt(this.$el.find("#availability_recur_num option:selected").val());
}

// 60 seconds in a minute, 60 minutes in an hour, 
// 24 hours a day, 7 days a week in milliseconds
AvailabilityRecurrence.ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

AvailabilityRecurrence.prototype.recurrenceInterval = function() {
  var recurrenceWeeks = parseInt(this.$el.find("#availability_recur_weekly option:selected").val());
  return AvailabilityRecurrence.ONE_WEEK * recurrenceWeeks;
}

AvailabilityRecurrence.prototype.recurrenceDates = function() {
  var dates = [];
  dates.push(this.availabilityTime());

  for(var i = 1; i <= this.numberOfRecurrences(); i++) {
    var sourceDate = this.availabilityTime();
    sourceDate.setTime(sourceDate.getTime() + (this.recurrenceInterval() * i));
    dates.push(sourceDate);
  }

  return dates;
}

AvailabilityRecurrence.prototype.recurrenceDatesSentence = function() {
  var sentence = "";
  var dates = this.recurrenceDates();
  for(var i = 0; i < dates.length; i++) {
    var date = dates[i];
    sentence += date.getMonth() + 1 + "/" + date.getDate();
    if(i < dates.length - 1) {
      sentence += ", "
    }

    if(i == dates.length - 2) {
      sentence += "and "
    }
  }

  return sentence;
}

AvailabilityRecurrence.prototype.handleValueChanges = function(browserEvent) {
  if(this.setupRecurrence) {
    this.$el.find(".recurrence_pattern").html(this.renderRecurrencePattern());
  }
}

AvailabilityRecurrence.prototype.init = function() {
  $(this.$el).find(".setup_recurrence").click(this.handleRecurrenceSetup.bind(this));
  $(this.$el).find("#availability_recur_weekly").change(this.handleValueChanges.bind(this));
  $(this.$el).find("#availability_recur_num").change(this.handleValueChanges.bind(this));

  $("#availability_start_time_1s").change(this.handleValueChanges.bind(this));
  $("#availability_start_time_4i").change(this.handleValueChanges.bind(this));
  $("#availability_start_time_5i").change(this.handleValueChanges.bind(this));
}

AvailabilityRecurrence.init = function(el) {
  (new AvailabilityRecurrence(el)).init();
}
