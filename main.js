
var $slider, $openDay, $table, $innerTable;

function formatInnerContent ( d ) {
	var $newSlider = $slider.clone();
	var $newRow = $newSlider.find('.icRow').clone();

	$newSlider.find('.icRow').remove();

	for ( var i=0; i<d.programs.length; i++ ) {
		var $thisRow = $newRow.clone();
		//$thisRow.find('.icCoverImage').html(d.programs[i].cover_image);
		$thisRow.find('.icTitle').html(d.programs[i].title);
		$thisRow.find('.icDescription').html(d.programs[i].description);
		$thisRow.find('.icTime').html(d.programs[i].start_time + ' until ' + d.programs[i].end_time);
		$thisRow.find('.icLocation').html(function(){
			var output = '<p class="room">' + d.programs[i].room + '</p>'
					 			 + '<p><span class="address">' + d.programs[i].location.address + '</span>, '
								 + '<span class="postcode">' + d.programs[i].location.postcode + '</span></p>';
			if ( d.programs[i].location.website ) {
				output += '<p class="website"><a href="' + d.programs[i].location.website + '" target="_blank">Website Link</a></p>';
			}
			return output;
		});
		$thisRow.find('.icType').html(d.programs[i].programType.type).css({backgroundColor:d.programs[i].programType.type_colour});
		$newSlider.find('tbody').append($thisRow);
	}

	return $newSlider;
}

$(document).ready(function() {
	$slider = $('#innerContent').remove();
	$openDay = $('#openDay');

	$table = $openDay.DataTable({
		ajax: {
			url: 'OpenDay.json',
			dataSrc: 'topics',
		},
		columns: [
			{	
				data: null,
				class: 'details-control',
				orderable: false,
				defaultContent: ''
			},
			{ 
				data: 'cover_image',
				orderable: false,
				width: '20%',
				render: function(data, type, row, meta) {
					return '<img src="' + row.cover_image + '" class="img-thumbnail">';
				}
			},
			{ 
				data: 'name',
				width: '30%',
				render: function(data, type, row, meta) {
					return '<h3>' + row.name + '<h3>';
				}
			},
			{ data: 'description' },
			{ 
				data: null,
				visible: false,
				orderable: false,
				width: 0,
				render: function(data, type, row, meta) {
					var allTitles = [];
					for ( var i=0; i<row.programs.length; i++ ) {
						allTitles.push(row.programs[i].title);
					}
					return allTitles.join(', ');
				}
			},
			{ 
				data: null,
				visible: false,
				orderable: false,
				width: 0,
				render: function(data, type, row, meta) {
					var allLocations = [];
					for ( var i=0; i<row.programs.length; i++ ) {
						allLocations.push(row.programs[i].room + ' ' + row.programs[i].location.title);
					}
					return allLocations.join(', ');
				}
			}
		],
		initComplete: function(settings, json) {
			$('#openDayTitle').html(json.description);
			$('#openDayDate').html(json.start_time + ' until ' + json.end_time);
		},
		responsive: {
			details: {
				display: $.fn.dataTable.Responsive.display.modal( {
						header: function ( row ) {
								var data = row.data();
								return 'Details for '+data[0]+' '+data[1];
						}
				} ),
				renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
						tableClass: 'table'
				} )
			}
		}
	});

	$openDay.on('click', 'td.details-control', function () {
		var tr = $(this).closest('tr');
		var row = $table.row( tr );

		if ( row.child.isShown() ) {
			$innerTable.destroy();
			$('div.slider', row.child()).slideUp( function () {
				row.child.hide();
				tr.removeClass('shown');
			} );
		}
		else {
			row.child( formatInnerContent(row.data()), 'no-padding inner-table' ).show();
			tr.addClass('shown');
			$('div.slider', row.child()).slideDown();
			$innerTable = $('#innerContent table').DataTable({
				responsive: true,
				columns: [
					{ width: '20%' },
					{ width: '40%' },
					{ width: '15%' },
					{ width: '15%' },
					{ width: '10%' }
				]
			});
		}
	} );

});

