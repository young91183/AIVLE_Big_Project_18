document.getElementById("ratingForm").addEventListener("submit", function(event) {
    var checklist = document.getElementsByClassName("rating-group");
    for (var i = 0; i < checklist.length; i++) {
        var radios = checklist[i].querySelectorAll("input[type='radio']");
        var checked = false;
        for (var j = 0; j < radios.length; j++) {
            if (radios[j].checked) {
                checked = true;
                break;
            }
        }
        if (!checked) {
            event.preventDefault(); // 폼 제출 막기
            alert("모든 항목을 완성해주세요.");
            break;
        }
    }
});