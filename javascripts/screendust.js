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
  // var timeout = 300
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
    var now = Date.now().toString()
    var timestampArray = [
      now.slice(0,  2),
      now.slice(2,  4),
      now.slice(4,  6),
      now.slice(6,  8),
      now.slice(8,  10),
      now.slice(10, 12)
    ]

    $('#timestamp').text('Timestamp: ' + timestampArray.join(':'))

    $('div').each(function() {
      if (style == 'now') {
        // console.log('now')
        blow($(this))
      } else if (style == 'lag') {
        // console.log('lag')
        var rand = getRandomIntInclusive(50, 300)
        var self = this

        function trigerBlow() {
          blow($(self))
        }

        setTimeout(function() { trigerBlow() }, rand)
      }
    })

    var empty =    $('.dustContainer > div > div:not(".s1"):not(".s2"):not(".s3")').length
    var born =     $('.s1').length
    var explode =  $('.s3').length
    $('#a').text('Empty (A): ' + empty)
    $('#b').text('Born (B): ' + born)
    $('#c').text('Explode (C): ' + explode)

    if (state) {
      if (Date.now() >= (timestamp + timeout)) {
        setTimeout(function() { markToBlow() }, timeout)
        timestamp = Date.now()
      }

      setTimeout(function() { cycle() }, speed)
    }
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

  $('#now').on('click', function() {
    changeState(1)
  })

  $('#lag').on('click', function() {
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

  changeState(1)
})
