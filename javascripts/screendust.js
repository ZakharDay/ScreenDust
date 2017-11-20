Number.prototype.times = function(cb) {
  var i = -1;

  while (++i < this) {
    cb(i);
  }

  return +this;
}

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime()
  }
}

var timeout = 300
var speed = 50
var style = 'now'
var state = false
var timestamp = Date.now()

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

$(function() {
  var rowElements = $('.dustContainer > div')
  var rows = $('.dustContainer > div').length
  var zoom = 1

  function changeState(f) {
    state = !state

    if (f == 1) {
      style = 'now'
    } else if (f == 2) {
      style = 'lag'
    }

    cycle()
  }

  function markToBlow() {
    rows.times(function(i) {
      var particles = $(rowElements[i]).find('div')
      var activeParticles = getRandomIntInclusive(3, 5)
      var activeElements = []

      activeParticles.times(function() {
        activeElements.push(particles[Math.floor(Math.random() * particles.length)])
      })

      $(activeElements).each(function() {
        var rand = getRandomIntInclusive(1, 300)
        var self = this

        function trigerBlow() {
          $(self).addClass('blow')
        }

        setTimeout(function() { trigerBlow() }, rand)
      })
    })
  }

  function cycle(f) {
    $('#timestamp').text(timestampText())

    $('div').each(function() {
      var rand = getRandomIntInclusive(50, 300)
      var self = this

      function trigerBlow() {
        blow($(self))
      }

      setTimeout(function() { trigerBlow() }, rand)
    })

    if (state) {
      if (Date.now() >= (timestamp + timeout)) {
        setTimeout(function() { markToBlow() }, timeout)
        timestamp = Date.now()
      }

      setTimeout(function() { cycle() }, speed)
    }

    updateCounters()
  }

  function timestampText() {
    var date        = new Date
    var year        = date.getFullYear().toString().slice(2, 4)
    var month       = (date.getMonth() + 1).toString()
    var day         = date.getDate().toString()
    var hour        = date.getHours().toString()
    var minute      = date.getMinutes().toString()
    var second      = date.getSeconds().toString()
    var millisecond = date.getMilliseconds().toString().slice(0, 2)

    month       = prefixZero(month)
    day         = prefixZero(day)
    hour        = prefixZero(hour)
    minute      = prefixZero(minute)
    second      = prefixZero(second)
    millisecond = prefixZero(millisecond)

    var timestampArray = [year, month, day, hour, minute, second, millisecond]
    var text = 'Timestamp: ' + timestampArray.join(':')

    return text
  }

  function prefixZero(s) {
    if (s.length == 1) {
      s = '0' + s
    }

    return s
  }

  function blow(particle) {
    if ($(particle).hasClass('blow')) {
      $(particle).removeClass('blow').addClass('s1')
    } else if ($(particle).hasClass('s1')) {
      $(particle).removeClass('s1').addClass('s2')
    } else if ($(particle).hasClass('s2')) {
      $(particle).removeClass('s2').addClass('s3')
    } else if ($(particle).hasClass('s3')) {
      $(particle).removeClass('s3')
    }
  }

  function updateCounters() {
    var empty   = $('.dustContainer > div > div:not(".s1"):not(".s2"):not(".s3")').length
    var born    = $('.s1').length.toString()
    var explode = $('.s3').length.toString()

    $('#a').text('Empty (A): '   + prefixZero(empty))
    $('#b').text('Born (B): '    + prefixZero(born))
    $('#c').text('Explode (C): ' + prefixZero(explode))
  }

  $('#stop').on('click', function() {
    var count = 6

    count.times(function(i) {
      setTimeout(function() { updateCounters() }, (i + 1) * 100)
    })

    changeState(2)
  })

  $('#zoomIn').on('click', function() {
    if (zoom <= 2) {
      zoom = zoom + 1
    }

    $('.dustContainer').css('transform', 'scale(' + zoom + ')')
  })

  $('#zoomOut').on('click', function() {
    if (zoom != 1) {
      zoom = zoom - 1
    }

    $('.dustContainer').css('transform', 'scale(' + zoom + ')')
  })

  changeState(2)
})
