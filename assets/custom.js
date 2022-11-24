var selectCallback = function(variant, selector){
    // BEGIN SWATCHES
    if (variant) {
    var form = jQuery('#' + selector.domIdPrefix).closest('form');
    for (var i = 0, length = variant.options.length; i < length; i++) {
    var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] + '"]');
    if (radioButton.size()) {
    radioButton.get(0).checked = true;
    }
    }
    }
    };