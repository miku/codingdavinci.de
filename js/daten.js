$(document).ready(function () {
	$('.data-entry').addClass('hidden');

	var filter = {
		category: null,
		type: null,
		license: null
	};
	var all_entries = [];

	function scrollToAnchor(aid) {
		var aTag = $("#" + aid);
		$('html,body').animate({scrollTop: aTag.offset().top - 50}, 'slow');
	}

	function buildEntryList() {

		var entries = all_entries.filter(function (entry) {
			if ((filter.category != null) && (entry.categories.indexOf(filter.category) < 0)) return false;
			if ((filter.type != null) && (entry.types.indexOf(filter.type) < 0)) return false;
			if ((filter.license != null) && (entry.licenses.indexOf(filter.license) < 0)) return false;
			return true;
		});

		// for each data entry a link in navigation
		var htm = entries.map(function (entry) {
			return '<li><a href="#' + entry.id + '" value="' + entry.id + '">' + entry.name + '</a></li>';
		}).join('');
		$(".nav-entries").html(htm);
		$(".nav-entries a").click(function (e) {
			var id = $(e.currentTarget).attr('value');
			$('.data-entry').addClass('hidden');
			$(".nav-entries li").removeClass('active');
			$('#' + id).removeClass('hidden');
			$(".nav-entries a[value='" + id + "']").parent().addClass('active');
			scrollToAnchor(id);
			e.stopPropagation();
			return false;
		});
	}

	function collectEntries() {
		// collect data entries´
		$('.data-entry').each(function (i, e) {
			e = $(e);
			var entry = {
				id: e.attr('id'),
				name: $('.data-interlude h3', e).text(),
				categories: [],
				licenses: [],
				types: []
			};
			$('.data-category .label', e).each(function (i, e) {
				entry.categories.push($(e).text());
			});
			$('.data-type .label', e).each(function (i, e) {
				entry.types.push($(e).text());
			});
			$('.data-license .label', e).each(function (i, e) {
				entry.licenses.push($(e).text());
			});
			if (entry.id !== 'start')
				all_entries.push(entry);
		});
		all_entries.sort(function (a, b) {
			if (a.name > b.name) return 1;
			if (a.name < b.name) return -1;
			return 0;
		});
	}

	function fillFilter(prop, mode, labeltype) {
		//collect categories
		var list = [];
		all_entries.forEach(function (entry) {
			entry[mode].forEach(function (cat) {
				if (list.indexOf(cat) < 0) list.push(cat);
			});
		});
		list.sort(function (a, b) {
			if (a > b) return 1;
			if (a < b) return -1;
			return 0;
		});
		var htm = list.map(function (entry) {
			return '<a href value="' + entry + '" class="label label-' + labeltype + '">' + entry + '</a>';
		}).join(' – ');
		$(".nav-filter-" + mode).html('<a href value="all" class="active">Alle</a> – ' + htm);
		$(".nav-filter-" + mode + " a").click(function (e) {
			var val = $(e.currentTarget).attr('value');
			filter[prop] = val == 'all' ? null : val;
			buildEntryList();
			$(".nav-filter-" + mode + " a").removeClass('active');
			$(".nav-filter-" + mode + " a[value='" + val + "']").addClass('active');
			e.stopPropagation();
			return false;
		});
	}

	collectEntries();
	fillFilter('category', 'categories', 'default');
	fillFilter('type', 'types', 'danger');
	fillFilter('license', 'licenses', 'info');
	buildEntryList();

	//show start
	$('#start').removeClass('hidden');

	//go to top - link
	$(".navigation-gotop").click(function (e) {
		scrollToAnchor('navigation-top');
		e.stopPropagation();
		return false;
	});

	// show all - link
	$(".navigation-all").click(function (e) {
		$('.data-entry').removeClass('hidden');
		$("#navigation-entries li").removeClass('active');
		e.stopPropagation();
		return false;
	});

});
