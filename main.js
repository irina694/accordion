function allocateHeights () {
  // Fairly allocate the max-heights for each list element inside the accordion.
  // Fair heights would be an equal distribution (available height / number of elements),
  // but some elements are smaller than others, so we must redistribute the unused height.
  // Headers must always be visible.

  // Examples with Available height = 800
  // if list heights are [500, 100, 300], then allocated heights should be [400, 100, 300]
  // if list heights are [500, 100, 340], then allocated heights should be [360, 100, 340]

    var availableHeight = $(window).height();
    var lists = $('ul');
    var numLists = lists.length;
    var items = [];
    for (var i = 0; i < numLists; i++) {
        var list = lists[i];
        var numItems = $(list).children().length;
        items.push(numItems);
    }

    var itemHeight = $('ul li').height();
    var headerHeight = $('header').height();
    var listHeights = [];
    var listIndexesToUpdate = [];
    var totalHeight = 0;
    for (var i = 0; i < numLists; i++) {
        var listHeight = headerHeight + itemHeight * items[i];
        listHeights.push(listHeight);
        listIndexesToUpdate.push(i);
        totalHeight += listHeight;
    }

    $('ul').css('min-height', '1px');

    while (numLists > 0 ) {

        var spaceEqually = availableHeight / numLists;
        var smallLists = [];
        for (var i = 0; i < listIndexesToUpdate.length; i++) {
            var index = listIndexesToUpdate[i];
            var listHeight = listHeights[index];
            if (listHeight < spaceEqually) {
                $('ul').eq(index).height(listHeight - $('header').height());
                smallLists.push(index);
            }
        }

        if (smallLists.length == 0) {
            for (var i = 0; i < listIndexesToUpdate.length; i++) {
                var index = listIndexesToUpdate[i];
                $('ul').eq(index).height(spaceEqually - headerHeight);
            }
            numLists = 0;
        }
        else {
            var smallListsHeight = 0;
            var numSmallLists = smallLists.length;
            for (var i = 0; i < numSmallLists; i++) {
                var index = smallLists[i];
                smallListsHeight += $('ul').eq(index).height();
            }
            availableHeight = availableHeight - smallListsHeight - headerHeight * numSmallLists;

            var largeLists = [];
            for (var i = 0; i < numLists; i++) {
                var index = listIndexesToUpdate[i];
                if ($.inArray(index, smallLists) == -1 && index != undefined) {
                    largeLists.push(index);
                }
            }
            listIndexesToUpdate = largeLists;
            numLists -= numSmallLists;
        }
    }
}

