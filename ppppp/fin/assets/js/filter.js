const filter_main = document.querySelector("#filter_main");
const filter_ranges = filter_main.querySelectorAll(".range");
const filter_target = filter_main.querySelector("#target");
const filter_dropshadow = filter_main.querySelector(".text").querySelector("input[type='text']");

function set_filter(){
    const rs = filter_main.querySelectorAll(".range");
    let property_value = "";
    rs.forEach(r => {
        const v = r.querySelector("input[type='range']").value;
        const n = r.querySelector(".name").textContent;

        let unit = "";
        if(n == "blur"){
            unit = "px";
        } else if(n == "hue-rotate"){
            unit = "deg";
        }

        property_value += `${n}(${v}${unit}) `;
    })

    if(filter_dropshadow.value != ""){
        property_value += `drop-shadow(${filter_dropshadow.value})`;
    }
    filter_target.style.filter = property_value;
}

function filter_set_event(){
    filter_ranges.forEach(range => {
        const input = range.querySelector("input[type='range']");
        const name = range.querySelector(".name").textContent;
        const min = input.min;
        const max = input.max;
        const step = input.step;

        const index = String(step).indexOf('.');
        const fix = index === -1 ? 0 : String(step).length - index - 1;


        input.addEventListener("input", () => {
            const val = input.value;
            range.style.setProperty("--value", `'${Number(val).toFixed(fix)}'`);
            const percent = (val - min) / (max - min) * 100;
            range.style.setProperty("--percent", percent);

            set_filter();
        })
        input.dispatchEvent(new Event("input"));
    })

    filter_dropshadow.addEventListener("input", set_filter);
}

filter_set_event();