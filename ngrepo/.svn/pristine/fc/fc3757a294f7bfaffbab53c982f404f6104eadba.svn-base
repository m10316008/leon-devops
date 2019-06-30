//console.log('management.js');

//use for holding the json from backed
var domainJson = {};
var certJson = {};

//use for html creation
var brand = [];
var domainArr = [];

//use for brand selection
var currentBrand = '';
if (window.location.href.split('/management/').length > 1) {
    currentBrand = window.location.href.split('/management/')[1];
}
var showAllBrand = currentBrand == 'ironman' ? true : false;



function objectFormatter() {
    var json = domainJson;

    var tempBrand = {}
    Object.keys(json).forEach(function (key) {
        domainArr.push({ host: key, dest: json[key].dest, brand: json[key].brand });

        if (brand.indexOf(json[key].brand) < 0) {
            brand.push(json[key].brand.toLowerCase());
        }
    });

    // sort the list by brand, host
    domainArr.sort(function (a, b) {
        if (a.brand < b.brand) return -1;
        if (a.brand > b.brand) return 1;

        if (a.host < b.host) return -1;
        if (a.host > b.host) return 1;

        return 0;
    });

    // sort the domain title
    brand.sort();
}

function createDomainTitle() {

    for (var i = 0; i < brand.length; i++) {
        var navHtml = '';
        navHtml += '<li class="nav-item">';
        navHtml += '<a class="nav-link" href="#" onclick="showDomainList(\'' + brand[i] + '\')">' + brand[i] + '</a>';
        navHtml += '</li>';

        $("#ulDomainTitle").append(navHtml);
    }
}


function createDomainTable() {

    var htmlTable = '<table class="userlist table table-hover">';
    htmlTable += '<thead><tr>';
    htmlTable += '<th>品牌</th>';
    htmlTable += '<th>不加密</th>';
    htmlTable += '<th>加密</th>';
    htmlTable += '<th>域名</th>';
    htmlTable += '<th>目的地</th>';
    htmlTable += '</tr></thead>';

    htmlTable += '<tbody>';
    for (var i = 0; i < domainArr.length; i++) {
        if (domainArr[i].brand.toLowerCase() == currentBrand) {

            htmlTable += '<tr>';
            htmlTable += '<td class="brand">' + domainArr[i].brand + '</td>';
            htmlTable += '<td><a href="http://' + domainArr[i].host + '" target="_blank">http</a></td>';

            if (certJson[domainArr[i].host]) {
                htmlTable += '<td><a href="https://' + domainArr[i].host + '" target="_blank">https</a></td>';
            } else {
                htmlTable += '<td>&nbsp;</td>';
            }

            htmlTable += '<td>' + domainArr[i].host + '</td>';
            htmlTable += '<td>' + domainArr[i].dest + '</td>';
            htmlTable += '</tr>';
        }
    }
    htmlTable += '</tbody>';


    htmlTable += '</table>';

    $("#content").html(htmlTable);
}


function showDomainList(host) {
    currentBrand = host;
    //alert('currentBrand : ' + currentBrand);
    createDomainTable();
}

function getDomainJson() {

    $.ajax('/management/domain.json?tt=' + (new Date()).getTime())
        .done(function (domain_json) {
            domainJson = domain_json;

            $.ajax('/management/ssl-domain.json?tt=' + (new Date()).getTime())
                .done(function (cert_json) {
                    certJson = cert_json;
                    objectFormatter();

                    if (showAllBrand) {
                        createDomainTitle();
                    }

                    createDomainTable();
                })
                .fail(function () {
                    alert("error");
                });

        })
        .fail(function () {
            alert("error");
        });
}



getDomainJson();