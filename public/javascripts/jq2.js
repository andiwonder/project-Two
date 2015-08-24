console.log("linked");



$('.video1').click(function (){
	$('#video2').hide();
	$('#video3').hide();
	$('#video1').toggle();
});

$('.video2').click(function (){
	$('#video1').hide();
	$('#video3').hide();
	$('#video2').toggle();
});

$('.video3').click(function (){
	$('#video1').hide();
	$('#video2').hide();
	$('#video3').toggle();
});

$('.squares').click(function (){
	console.log($(this).attr('id'));
})


$('.comment_toggle').click(function (){
	$('#comment_field').toggle();
});