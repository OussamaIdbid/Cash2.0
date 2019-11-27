function getButtonIndex() {

    var clickedIndex;
    $('.category-button').click(function () {
        alert($('.category-button').index(this) + 1)

        clickedIndex = $('.category-button').index(this) + 1
    });

    return clickedIndex
    // var clickedIndex = $('.category-button').index(this);

}

function emptyFields() {
    $('#name-input').val('Naam van het product');
    $('#price-input').val('Prijs van het product');
    $('#category-placeholder').val('Selecteer categorie');

    var div = document.createElement('div');
    $(div).attr('class', 'alert alert-success')
    $(div).attr('role', 'alert')
    $(div).html('Product toegevoegd')


    $('#product-add-form').append(div)
    setTimeout(function () {

        $(div).remove()
    }, 2000)



}