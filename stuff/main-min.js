function checkEnter(e) {
  e && 13 == e.keyCode && (reset(),
  findPackingStrategy())
}
function reset() {
  for (var e = document.getElementsByClassName("cut message"), a = 0; a < e.length; )
      e[a].innerHTML = "",
      a++;
  globalVariables.cutQueue = [],
  globalVariables.sheet = [],
  globalVariables.previousUncutNumber = "NotANumber",
  globalVariables.unCutMultiple = 0,
  globalVariables.anotherPass = !0,
  globalVariables.findEmptyNodesRun = !1,
  globalVariables.currentSheet = 0,
  document.getElementById("canvas-container").innerHTML = "",
  globalVariables.offCuts = [],
  globalVariables.index = 0
}
function createEventListeners() {
  document.getElementById("create-sheet").addEventListener("click", function() {
      createSheetInput()
  }),
  document.getElementById("create-cut").addEventListener("click", function() {
      createCutInput()
  }),
  document.getElementById("calculate").addEventListener("click", function() {
      reset(),
      globalVariables.cutWarningFired = !1,
      globalVariables.sheetWarningFired = !1,
      globalVariables.autoSheetCreated = !1,
      findPackingStrategy()
  }),
  document.getElementById("show-offcuts").addEventListener("click", function() {
      drawFreeSpace()
  }),
  document.getElementById("save").addEventListener("click", function() {
      save(),
      showMessage("Project saved - you can only save one project at the moment")
  }),
  document.getElementById("recall").addEventListener("click", function() {
      showMessage("Project loaded"),
      recall()
  }),
  document.getElementById("rip-priority").addEventListener("click", function() {
      0 == globalVariables.ripPriority ? (globalVariables.ripPriority = !0,
      globalVariables.crossCutPriority = !1,
      document.getElementById("rip-priority").style.backgroundColor = "green",
      globalVariables.algorithms.algo1 = !1,
      globalVariables.algorithms.algo2 = !1,
      globalVariables.crossCutPriority = !1,
      document.getElementById("cross-cut-priority").style.backgroundColor = "red") : (globalVariables.ripPriority = !1,
      globalVariables.crossCutPriority = !1,
      document.getElementById("rip-priority").style.backgroundColor = "red",
      globalVariables.algorithms.algo1 = !0,
      globalVariables.algorithms.algo2 = !0)
  }),
  document.getElementById("cross-cut-priority").addEventListener("click", function() {
      0 == globalVariables.crossCutPriority ? (globalVariables.crossCutPriority = !0,
      globalVariables.ripPriority = !1,
      document.getElementById("cross-cut-priority").style.backgroundColor = "green",
      globalVariables.algorithms.algo1 = !1,
      globalVariables.algorithms.algo2 = !1,
      globalVariables.ripPriority = !1,
      document.getElementById("rip-priority").style.backgroundColor = "red") : (globalVariables.crossCutPriority = !1,
      globalVariables.ripPriority = !1,
      document.getElementById("cross-cut-priority").style.backgroundColor = "red",
      globalVariables.algorithms.algo1 = !0,
      globalVariables.algorithms.algo2 = !0)
  }),
  document.getElementById("sheet-material").addEventListener("click", function() {
      if ("linear" == globalVariables.mode) {
          globalVariables.mode = "sheet",
          document.getElementById("sheet-material").style.backgroundColor = "green",
          globalVariables.algorithms.algo1 = !0,
          globalVariables.algorithms.algo2 = !0,
          document.getElementById("options-wrapper").style.display = "block",
          document.getElementById("linear-material").style.backgroundColor = "red";
          for (var e = 0, a = document.getElementsByClassName("grain-preference"); e < a.length; )
              a[e].disabled = !1,
              a[e].style.display = "inline-block",
              e++;
          showHelp("sheet");
          for (var l = document.getElementsByClassName("width"), t = l.length, i, e = 0, s = JSON.parse(localStorage.getItem("originalWidths")); t > e; )
              l[e].value = parseFloat(s[e]),
              l[e].style.display = "inline-block",
              e++
      }
  }),
  document.getElementById("linear-material").addEventListener("click", function() {
      if ("sheet" == globalVariables.mode) {
          globalVariables.mode = "linear",
          document.getElementById("linear-material").style.backgroundColor = "green",
          globalVariables.algorithms.algo1 = !1,
          globalVariables.algorithms.algo2 = !1,
          document.getElementById("options-wrapper").style.display = "none",
          globalVariables.crossCutPriority = !1,
          globalVariables.ripPriority = !1,
          document.getElementById("rip-priority").style.backgroundColor = "red",
          document.getElementById("cross-cut-priority").style.backgroundColor = "red",
          document.getElementById("sheet-material").style.backgroundColor = "red";
          for (var e = 0, a = document.getElementsByClassName("grain-preference"); e < a.length; )
              a[e].disabled = !0,
              a[e].style.display = "none",
              e++;
          showHelp("linear");
          var l = document.getElementsByClassName("width"), t = l.length, i, s = [];
          for (e = 0; t > e; )
              i = l[e].value,
              s.push(i),
              l[e].style.display = "none",
              e++;
          localStorage.setItem("originalWidths", JSON.stringify(s))
      }
  }),
  document.getElementById("add-new-sheets").addEventListener("click", function() {
      0 == globalVariables.autoAddNewSheets ? (globalVariables.autoAddNewSheets = !0,
      document.getElementById("add-new-sheets").style.backgroundColor = "green",
      document.getElementById("auto-sheet-input").style.display = "block") : (globalVariables.autoAddNewSheets = !1,
      document.getElementById("add-new-sheets").style.backgroundColor = "red",
      document.getElementById("auto-sheet-input").style.display = "none")
  }),
  document.getElementById("help-toggle").addEventListener("click", function() {
      var e = document.getElementsByClassName("help-text")
        , a = e.length
        , l = 0;
      if (1 == globalVariables.helpShown) {
          for (; a > l; )
              e[l].style.display = "none",
              l++;
          globalVariables.helpShown = !1
      } else {
          for (; a > l; )
              e[l].style.display = "block",
              l++;
          globalVariables.helpShown = !0
      }
  })
}
function showHelp(e) {
  if ("linear" == e)
      var a = "linear-help"
        , l = "sheet-help";
  else if ("sheet" == e)
      var a = "sheet-help"
        , l = "linear-help";
  for (var t = document.getElementsByClassName(a), i = 0; i < t.length; )
      t[i].style.display = "block",
      i++;
  for (var s = document.getElementsByClassName(l), i = 0; i < s.length; )
      s[i].style.display = "none",
      i++
}
function createCutInput() {
  console.log("createCutInput triggered");
  var e = document.getElementById("cut-container")
    , a = document.createElement("div");
  a.className = "individual-cut-wrapper",
  "sheet" == globalVariables.mode ? a.innerHTML = '<input class="cut number" value="' + globalVariables.cutNumber++ + '" readonly disabled><input type="text" class="cut name" value="" placeholder="Name"><input type="number" class="cut width" value=""  placeholder="Width"><input type="number" class="cut length" value=""  placeholder="Length"><input type="number" class="cut quantity" value=""  placeholder="Quantity"><select class="grain-preference"><option value="noPreference" selected>No grain preference</option><option value="horizontal">Long edge grain</option><option value="vertical">Short edge grain</option></select><div class="cut-delete-button">Delete cut</div><div class="cut message"></div>' : "linear" == globalVariables.mode && (a.innerHTML = '<input class="cut number" value="' + globalVariables.cutNumber++ + '" readonly disabled><input type="text" class="cut name" value="" placeholder="Name"><input type="number" class="cut width" value="' + globalVariables.linearWidth + '"  placeholder="Width" style="display: none;"><input type="number" class="cut length" value=""  placeholder="Length"><input type="number" class="cut quantity" value=""  placeholder="Quantity"><select class="grain-preference" disabled style="display: none;"><option value="noPreference" selected>No grain preference</option><option value="horizontal">Long edge grain</option><option value="vertical">Short edge grain</option></select><div class="cut-delete-button">Delete cut</div><div class="cut message"></div>'),
  e.appendChild(a);
  var l = document.getElementsByClassName("cut-delete-button")
    , e = document.getElementsByClassName("individual-cut-wrapper")
    , t = e[globalVariables.cutNumber - 2];
  l[l.length - 1].addEventListener("click", function() {
      console.log(this),
      this.parentElement.parentElement.removeChild(t),
      globalVariables.cutNumber--;
      for (var e = 0, a = document.getElementsByClassName("cut number"); e < a.length; )
          a[e].value = e + 1,
          e++
  })
}
function createSheetInput(e, a, l) {
  console.log("createSheetInput triggered");
  var t = document.getElementById("sheet-container")
    , i = document.createElement("div");
  i.className = "individual-sheet-wrapper",
  e !== !0 ? "sheet" == globalVariables.mode ? i.innerHTML = '<input class="sheet number" value="' + globalVariables.sheetNumber++ + '" readonly disabled><input type="text" class="sheet name" value="" placeholder="Name"><input type="number" class="sheet width" value="" placeholder="Width"><input type="number" class="sheet length" value="" placeholder="Length"><input type="number" class="sheet quantity" value="1"  placeholder="Quantity" id="auto-sheet-quantity"><div class="sheet-delete-button">Delete stock</div>' : "linear" == globalVariables.mode && (i.innerHTML = '<input class="sheet number" value="' + globalVariables.sheetNumber++ + '" readonly disabled><input type="text" class="sheet name" value="" placeholder="Name"><input type="number" style="display: none;" class="sheet width" value="' + globalVariables.linearWidth + '" placeholder="Width"><input type="number" class="sheet length" value="" placeholder="Length"><input type="number" class="sheet quantity" value="1"  placeholder="Quantity" id="auto-sheet-quantity"><div class="sheet-delete-button">Delete stock</div>') : "sheet" == globalVariables.mode ? i.innerHTML = '<input class="sheet number" value="' + globalVariables.sheetNumber++ + '" readonly disabled><input type="text" class="sheet name" value="Auto sheet" placeholder="Name"><input type="number" class="sheet width" value="' + a + '" placeholder="Width"><input type="number" class="sheet length" value="' + l + '" placeholder="Length"><input type="number" class="sheet quantity" value="1"  placeholder="Quantity" id="auto-sheet-quantity"><div class="sheet-delete-button">Delete stock</div>' : "linear" == globalVariables.mode && (i.innerHTML = '<input class="sheet number" value="' + globalVariables.sheetNumber++ + '" readonly disabled><input type="text" class="sheet name" value="Auto sheet" placeholder="Name"><input type="number" style="display: none;" class="sheet width" value="' + globalVariables.linearWidth + '" placeholder="Width"><input type="number" class="sheet length" value="' + l + '" placeholder="Length"><input type="number" class="sheet quantity" value="1"  placeholder="Quantity" id="auto-sheet-quantity"><div class="sheet-delete-button">Delete stock</div>'),
  t.appendChild(i);
  var s = document.getElementsByClassName("sheet-delete-button")
    , t = document.getElementsByClassName("individual-sheet-wrapper")
    , o = t[globalVariables.sheetNumber - 2];
  s[s.length - 1].addEventListener("click", function() {
      this.parentNode.parentNode.removeChild(o),
      globalVariables.sheetNumber--;
      for (var e = 0, a = document.getElementsByClassName("sheet number"); e < a.length; )
          a[e].value = e + 1,
          e++
  })
}
function save() {
  var e = document.getElementsByTagName("input")
    , a = e.length
    , l = []
    , t = 0
    , i = document.getElementsByClassName("cut number").length
    , s = document.getElementsByClassName("sheet number").length;
  for (localStorage.setItem("numberOfCuts", i),
  localStorage.setItem("numberOfSheets", s); a > t; )
      l.push(e[t].value),
      t++;
  var o = JSON.stringify(l);
  localStorage.setItem("inputData", o);
  for (var r = document.getElementsByTagName("select"), a = r.length, l = [], t = 0; a > t; )
      l.push(r[t].selectedIndex),
      t++;
  var o = JSON.stringify(l);
  localStorage.setItem("dropDownData", o)
  localStorage.setItem("mode", globalVariables.mode)
}
function recall() {
  globalVariables.mode = localStorage.getItem('mode') || 'linear'
  document.getElementById(globalVariables.mode + "-material").click()
  r = 0;
  for (var e = document.getElementsByClassName("individual-sheet-wrapper"), a = e.length; a > r; )
      e[0].parentNode.removeChild(e[0]),
      r++;
  globalVariables.sheetNumber = 1,
  r = 0;
  for (var l = document.getElementsByClassName("individual-cut-wrapper"), a = l.length; a > r; )
      l[0].parentNode.removeChild(l[0]),
      r++;
  globalVariables.cutNumber = 1;
  var t = parseFloat(localStorage.getItem("numberOfCuts"))
    , i = parseFloat(localStorage.getItem("numberOfSheets"));
  for (r = 0; t > r; )
      createCutInput(),
      r++;
  for (r = 0; i > r; )
      createSheetInput(),
      r++;
  for (var s = document.getElementById("input-wrapper").getElementsByTagName("input"), o = JSON.parse(localStorage.getItem("inputData")), a = s.length, r = 0; a > r; )
      s[r].value = o[r],
      r++;
  var n = document.getElementsByTagName("select")
    , b = JSON.parse(localStorage.getItem("dropDownData"))
    , a = n.length;
  for (r = 0; a > r; )
      n[r].selectedIndex = b[r],
      r++;
  globalVariables.cutNumber = document.getElementsByClassName("cut number").length + 1,
  globalVariables.sheetNumber = document.getElementsByClassName("sheet number").length + 1,
  reset(),
  findPackingStrategy()
}
function showMessage(e) {
  var a = document.getElementById("message-area");
  a.innerHTML += "<li>" + e + "</li>",
  a.scrollTop = a.scrollHeight - a.clientHeight,
  clearTimeout(globalVariables.messageTimer),
  1 != globalVariables.messageAreaOpen && (a.className = "animateIn",
  globalVariables.messageAreaOpen = !0),
  globalVariables.messageTimer = setTimeout(function() {
      globalVariables.messageAreaOpen = !1,
      a.className = "animateOut",
      a.innerHTML = ""
  }, 6e3)
}
function checkHit(e, a, l) {
  for (var t = !1, i = 0, s, o; i < globalVariables.allCuts.length; ) {
      if (globalVariables.allCuts[i].fit && globalVariables.allCuts[i].fit.sheet == l) {
          var r = globalVariables.sheet[l].divider;
          if (s = globalVariables.allCuts[i].fit.x * r,
          right = globalVariables.allCuts[i].fit.x * r + globalVariables.allCuts[i].w * r,
          o = globalVariables.allCuts[i].fit.y * r,
          bottom = globalVariables.allCuts[i].fit.y * r + globalVariables.allCuts[i].h * r,
          right >= e && e >= s && bottom >= a && a >= o)
              return hitIndexNumber = globalVariables.allCuts[i].index,
              [hitIndexNumber, i]
      }
      i++
  }
}
function createSheets() {
  var e = document.getElementById("input-wrapper").getElementsByClassName("sheet width"), a = document.getElementById("input-wrapper").getElementsByClassName("sheet length"), l = document.getElementById("input-wrapper").getElementsByClassName("sheet quantity"), t = document.getElementById("input-wrapper").getElementsByClassName("sheet name"), i, s = e.length;
  if (0 == globalVariables.sheetWarningFired) {
      for (var o = 0, r; o < e.length; )
          e[o].style.backgroundColor = "white",
          a[o].style.backgroundColor = "white",
          l[o].style.backgroundColor = "white",
          ("sheet" != globalVariables.mode || "" != e[o].value && "" != a[o].value && "" != l[o].value) && ("linear" != globalVariables.mode || "" != a[o].value && "" != l[o].value) || ("" == e[o].value && highlightField(e, o),
          "" == a[o].value && highlightField(a, o),
          "" == l[o].value && highlightField(l, o),
          r = !0),
          o++;
      if (1 == r)
          return void showMessage("Add some detail to the highlighted sheet fields")
  }
  for (var o = 0, n; s > o; ) {
      var b = longEdge(parseFloat(a[o].value), parseFloat(e[o].value));
      for (width = b[0],
      height = b[1],
      i = parseFloat(l[o].value),
      name = t[o].value,
      n = 0; i > n; )
          globalVariables.sheet.push({
              w: width,
              h: height,
              name: name
          }),
          n++;
      o++
  }
}
function findPackingStrategy() {
  console.count("findPackingStrategy triggered");
  var e = 0
    , a = 0
    , l = [];
  if ("sheet" == globalVariables.mode) {
      for (; a < globalVariables.numberOfStrategies; ) {
          if (totalRemainingArea = 0,
          e = 0,
          globalVariables.sheetRemainder[a] = [],
          getCuts(a, !0),
          totalDidNotFit = globalVariables.sheetRemainder[a][0],
          "undefined" == typeof globalVariables.algo1UnusedNodes)
              return;
          for (; e < globalVariables.algo1UnusedNodes.length; )
              0 == globalVariables.algo1UnusedNodes[e].sheet && (totalRemainingArea += globalVariables.algo1UnusedNodes[e].h * globalVariables.algo1UnusedNodes[e].w),
              e++;
          l.push(totalRemainingArea),
          reset(),
          a++
      }
      globalVariables.sheet = [];
      var t = Math.min.apply(null, l)
        , i = l.indexOf(t);
      console.log("winning strategy is " + i + " , with an remaining area of " + t + " on sheet 0"),
      reset(),
      globalVariables.didNotFit = [],
      globalVariables.winningStrategy = i,
      getCuts(i)
  } else
      getCuts("linear")
}
function pack(e, a) {
  switch (globalVariables.allCuts = globalVariables.cutQueue,
  e) {
  case 0:
      globalVariables.cutQueue.sort(sortHeightDescWidthDesc);
      break;
  case 1:
      globalVariables.cutQueue.sort(sortWidthDescHeightDesc);
      break;
  case 2:
      globalVariables.cutQueue.sort(sortProportion);
      break;
  case 3:
      globalVariables.cutQueue.sort(sortHeightDescWidthDesc);
      break;
  case 4:
      globalVariables.cutQueue.sort(sortWidthDescHeightDesc);
      break;
  case 5:
      globalVariables.cutQueue.sort(sortProportion);
      break;
  case "linear":
      globalVariables.cutQueue.sort(sortHeightDesc);
      break;
  default:
      return void console.log("sort strategy not defined for strategy number")
  }
  for (; globalVariables.currentSheet < globalVariables.sheet.length; ) {
      globalVariables.currentSheet > 0 && 0 == globalVariables.ripPriority && reverseOrientation("cutQueue"),
      globalVariables.space.w = globalVariables.sheet[globalVariables.currentSheet].w,
      globalVariables.space.h = globalVariables.sheet[globalVariables.currentSheet].h;
      var l = new packingAlgorithm(globalVariables.sheet[globalVariables.currentSheet].w,globalVariables.sheet[globalVariables.currentSheet].h,0,0,globalVariables.currentSheet);
      if (l.fit(globalVariables.cutQueue, globalVariables.currentSheet, null, !1),
      drawSheet(globalVariables.currentSheet),
      1 != a) {
          var t = 0;
          for (length = globalVariables.cutQueue.length; t < length; )
              globalVariables.cutQueue[t].fit && drawCut(globalVariables.cutQueue[t].fit.x, globalVariables.cutQueue[t].fit.y, globalVariables.cutQueue[t].w, globalVariables.cutQueue[t].h, t, "cutQueue", !1, !1, globalVariables.cutQueue[t].fit.sheet),
              t++;
          for (t = 0; t < length; )
              globalVariables.cutQueue[t].fit && drawCutLines(globalVariables.cutQueue[t].fit.x, globalVariables.cutQueue[t].fit.y, globalVariables.cutQueue[t].w, globalVariables.cutQueue[t].h, t, "cutQueue", !1, globalVariables.cutQueue[t].fit.sheet),
              t++
      }
      globalVariables.findEmptyNodesRun = !1,
      globalVariables.anotherPass = !0,
      globalVariables.cutQueue = globalVariables.didNotFit,
      "sheet" == globalVariables.mode && 1 == a && globalVariables.sheetRemainder[e].push(globalVariables.didNotFit.length),
      globalVariables.currentSheet++
  }
  showDidNotFit(a),
  console.count("pack completed"),
  1 != a && showMessage("Cut diagrams generated, please scroll down to view")
}
function highlightField(e, a) {
  e[a].style.backgroundColor = "yellow"
}
function getCuts(e, a) {
  if ("linear" == globalVariables.mode) {
      for (var l = [], t = document.getElementsByClassName("sheet length"), i = 0; i < t.length; )
          isNaN(parseFloat(t[i].value)) || l.push(parseFloat(t[i].value)),
          i++;
      var s = Math.max(l);
      globalVariables.linearWidth = .1 * s,
      i = 0;
      for (var o = document.getElementsByClassName("width"); i < o.length; )
          o[i].value = globalVariables.linearWidth,
          i++
  }
  createSheets();
  var r = document.getElementsByClassName("cut width")
    , n = document.getElementsByClassName("cut length")
    , b = document.getElementsByClassName("cut quantity")
    , g = document.getElementsByClassName("cut number")
    , d = document.getElementsByClassName("cut name");
  if (globalVariables.bladeWidth = parseFloat(document.getElementById("blade-width").value),
  0 == globalVariables.cutWarningFired) {
      for (var i = 0, u; i < r.length; )
          r[i].style.backgroundColor = "white",
          n[i].style.backgroundColor = "white",
          b[i].style.backgroundColor = "white",
          ("sheet" != globalVariables.mode || "" != r[i].value && "" != n[i].value && "" != b[i].value) && ("linear" != globalVariables.mode || "" != n[i].value && "" != b[i].value) || ("" == r[i].value && highlightField(r, i),
          "" == n[i].value && highlightField(n, i),
          "" == b[i].value && highlightField(b, i),
          globalVariables.cutWarningFired = !0,
          u = !0),
          i++;
      if (1 == u)
          return void showMessage("Add some detail to the highlighted cut fields")
  }
  for (var i = 0, h = 0, c = r.length, V, m, p, v, f, y = [], C = [], w, N, x, E = document.getElementsByClassName("grain-preference"); c > i; ) {
      if (V = parseFloat(r[i].value) + globalVariables.bladeWidth,
      m = parseFloat(n[i].value) + globalVariables.bladeWidth,
      p = parseFloat(b[i].value),
      v = parseFloat(g[i].value),
      f = d[i].value,
      w = longEdge(m, V),
      "sheet" == globalVariables.mode)
          switch (e) {
          case 0:
          case 1:
          case 2:
              m = w[0],
              V = w[1];
              break;
          case 3:
          case 4:
          case 5:
              m = w[1],
              V = w[0];
              break;
          default:
              m = w[0],
              V = w[1]
          }
      else if ("linear" == globalVariables.mode)
          for (var S = 0, k = globalVariables.sheet.length; k > S; ) {
              if (globalVariables.sheet[S].w + globalVariables.bladeWidth == w[0] || globalVariables.sheet[S].h + globalVariables.bladeWidth == w[1]) {
                  m = w[0],
                  V = w[1];
                  break
              }
              if (globalVariables.sheet[S].w + globalVariables.bladeWidth == w[1] || globalVariables.sheet[S].h + globalVariables.bladeWidth == w[0]) {
                  m = w[1],
                  V = w[0];
                  break
              }
              S++
          }
      "sheet" == globalVariables.mode && ("horizontal" == E[i].value ? (m = w[0],
      V = w[1]) : "vertical" == E[i].value && (m = w[1],
      V = w[0]));
      var F = m / V
        , B = V / m;
      for (N = F >= B ? F : B,
      h = 0; p > h; )
          "sheet" == globalVariables.mode && 0 == globalVariables.ripPriority && 0 == globalVariables.crossCutPriority && N > globalVariables.deferProportion ? (x = !0,
          console.count("defer triggered")) : x = !1,
          globalVariables.cutQueue.push({
              index: globalVariables.index,
              number: v,
              w: m,
              h: V,
              area: m * V,
              name: f,
              proportion: N,
              defer: x
          }),
          globalVariables.index++,
          h++;
      i++
  }
  console.count("getCuts completed"),
  pack(e, a)
}
function longEdge(e, a) {
  if (a > e) {
      var l = e
        , t = a;
      a = l,
      e = t
  }
  return [e, a]
}
function sortHeightDescWidthDesc(e, a) {
  return e.h < a.h ? 1 : e.h > a.h ? -1 : e.w === a.w ? e.index - a.index : e.w < a.w ? 1 : e.w > a.w ? -1 : void 0
}
function sortWidthDescHeightDesc(e, a) {
  return e.w < a.w ? 1 : e.w > a.w ? -1 : e.w === a.w ? e.index - a.index : e.h < a.h ? 1 : e.h > a.h ? -1 : void 0
}
function sortHeightDesc(e, a) {
  return e.h < a.h ? 1 : e.h > a.h ? -1 : e.w === a.w ? e.index - a.index : void 0
}
function sortProportion(e, a) {
  return e.proportion < a.proportion ? 1 : e.proportion > a.proportion ? -1 : e.proportion === a.proportion ? e.index - a.index : void 0
}
function sortNumber(e, a) {
  return e.number < a.number ? -1 : e.number > a.number ? 1 : e.number === a.number ? e.index - a.index : void 0
}
function sortIndexAsc(e, a) {
  return e.index < a.index ? -1 : e.index > a.index ? 1 : 0
}
function sortIndexDesc(e, a) {
  return e.index < a.index ? 1 : e.index > a.index ? -1 : 0
}
function createCanvas(e, a, l) {
  var t = document.getElementById("canvas-container")
    , i = document.createElement("div")
    , s = document.createElement("canvas")
    , o = document.createElement("canvas")
    , r = document.createElement("div");
  if (s.width = a,
  s.height = l,
  s.className = "cut-canvas",
  s.dataset.sheet = e,
  o.width = a,
  o.height = l,
  o.className = "line-canvas",
  o.dataset.sheet = e,
  i.className = "input-zone",
  "" != globalVariables.sheet[e].name)
      var n = "Sheet name: " + globalVariables.sheet[e].name + "<br>";
  else
      var n = "";
  "sheet" == globalVariables.mode ? i.innerHTML = n + "Material length: " + globalVariables.sheet[e].w + "<br>Material width: " + globalVariables.sheet[e].h + '<div class="cut-information"></div>' : i.innerHTML = n + "Material length: " + globalVariables.sheet[e].w + "</div>",
  r.className = "canvas-wrapper",
  r.appendChild(s),
  r.appendChild(o),
  t.appendChild(i),
  t.appendChild(r);
  var b = document.getElementsByClassName("cut-canvas")
    , g = b[e]
    , d = document.getElementsByClassName("line-canvas")
    , u = d[e];
  if (g.getContext) {
      globalVariables.cutCanvas[globalVariables.currentSheet] = s.getContext("2d"),
      g.height = s.height,
      g.width = s.width,
      globalVariables.lineCanvas[globalVariables.currentSheet] = o.getContext("2d"),
      u.height = o.height,
      u.width = o.width;
      var r = document.getElementsByClassName("canvas-wrapper");
      r[globalVariables.currentSheet].style.height = o.height + "px";
      var h = window.devicePixelRatio || 1
        , c = globalVariables.cutCanvas[globalVariables.currentSheet].webkitBackingStorePixelRatio || globalVariables.cutCanvas[globalVariables.currentSheet].mozBackingStorePixelRatio || globalVariables.cutCanvas[globalVariables.currentSheet].msBackingStorePixelRatio || globalVariables.cutCanvas[globalVariables.currentSheet].oBackingStorePixelRatio || globalVariables.cutCanvas[globalVariables.currentSheet].backingStorePixelRatio || 1
        , V = h / c;
      if (h !== c) {
          var m = s.width
            , p = s.height;
          g.width = m * V,
          g.height = p * V,
          g.style.width = m + "px",
          g.style.height = p + "px",
          u.width = m * V,
          u.height = p * V,
          u.style.width = m + "px",
          u.style.height = p + "px",
          globalVariables.cutCanvas[globalVariables.currentSheet].scale(V, V),
          globalVariables.lineCanvas[globalVariables.currentSheet].scale(V, V)
      }
  } else
      alert("HTML5 canvas is not supported on your browser, but it's needed to draw the shapes. Please try a more modern browser.");
  u.addEventListener("click", function(e) {
      var a = parseFloat(e.currentTarget.dataset.sheet)
        , l = checkHit(e.offsetX, e.offsetY, a);
      console.log("click: " + e.offsetX + "/" + e.offsetY + " on sheet " + a),
      "undefined" != typeof l && l[0] >= 0 ? highlight(l[1], a) : console.log("no hit")
  }, !1)
}
function drawSheet(e) {
  var a = window.innerWidth
    , l = a - 50;
  l > 600 && (l = 1e3);
  var t = l / globalVariables.sheet[globalVariables.currentSheet].w
    , i = globalVariables.sheet[globalVariables.currentSheet].h * t;
  globalVariables.sheet[e].divider = t,
  createCanvas(e, l, i),
  globalVariables.cutCanvas[globalVariables.currentSheet].fillStyle = globalVariables.colours.sheet,
  globalVariables.cutCanvas[globalVariables.currentSheet].fillRect(0, 0, l, i),
  globalVariables.cutCanvas[globalVariables.currentSheet].fill()
}
function drawCut(e, a, l, t, i, s, o, r, n) {
  var b = globalVariables.sheet[n].divider;
  height = Math.floor(t * b),
  width = Math.floor(l * b),
  e *= b,
  a *= b;
  var g = globalVariables.bladeWidth * b;
  globalVariables[s][i].edge && (globalVariables[s][i].edge.right === !0 && (width = (l - globalVariables.bladeWidth) * b),
  globalVariables[s][i].edge.bottom === !0 && (height = (t - globalVariables.bladeWidth) * b),
  globalVariables.cutCanvas[n].fill()),
  globalVariables.cutCanvas[n].beginPath(),
  o !== !0 ? (globalVariables.cutCanvas[n].fillStyle = globalVariables.colours.cutFill,
  globalVariables.cutCanvas[n].fillRect(e, a, width, height),
  0 == r && (globalVariables[s][i].w * b > 15 && globalVariables[s][i].h * b > 15 && (globalVariables.lineCanvas[n].beginPath(),
  globalVariables.lineCanvas[n].fillStyle = globalVariables.colours.text,
  globalVariables.lineCanvas[n].font = globalVariables.colours.labelFontSize + "px Arial",
  globalVariables.lineCanvas[n].textAlign = "center",
  globalVariables.lineCanvas[n].textBaseline = "bottom",
  globalVariables.lineCanvas[n].fillText(globalVariables[s][i].number, e + width / 2 - g / 2, a + height / 2 + globalVariables.colours.labelFontSize / 2 - g / 2)),
  globalVariables[s][i].w * b > 60 && globalVariables[s][i].h * b > 60 && (globalVariables.lineCanvas[n].beginPath(),
  globalVariables.lineCanvas[n].fillStyle = globalVariables.colours.text,
  globalVariables.lineCanvas[n].font = globalVariables.colours.dimensionsFontSize + "px Arial",
  globalVariables.lineCanvas[n].textAlign = "center",
  globalVariables.lineCanvas[n].fillText(globalVariables[s][i].w - globalVariables.bladeWidth, e + width / 2 - g / 2, a + height - 2 - g),
  "sheet" == globalVariables.mode && (globalVariables.lineCanvas[n].beginPath(),
  globalVariables.lineCanvas[n].fillStyle = globalVariables.colours.text,
  globalVariables.lineCanvas[n].font = globalVariables.colours.dimensionsFontSize + "px Arial",
  globalVariables.lineCanvas[n].textAlign = "left",
  globalVariables.lineCanvas[n].fillText(globalVariables[s][i].h - globalVariables.bladeWidth, e + 2, a + height / 2 + globalVariables.colours.labelFontSize / 2 - g / 2))),
  globalVariables[s][i].w * b > 60 && globalVariables[s][i].h * b > 60 && (globalVariables.lineCanvas[n].beginPath(),
  globalVariables.lineCanvas[n].fillStyle = globalVariables.colours.text,
  globalVariables.lineCanvas[n].font = globalVariables.colours.labelFontSize + "px Arial",
  globalVariables.lineCanvas[n].textAlign = "center",
  globalVariables.lineCanvas[n].textBaseline = "bottom",
  globalVariables.lineCanvas[n].fillText(globalVariables[s][i].name, e + width / 2 - g / 2, a + globalVariables.colours.labelFontSize + 2)))) : (globalVariables.cutCanvas[n].fillStyle = globalVariables.colours.highlightFill,
  globalVariables.cutCanvas[n].fillRect(e, a, width, height))
}
function highlight(e, a) {
  "undefined" != typeof globalVariables.hightlightedCut && drawCut(globalVariables.allCuts[globalVariables.hightlightedCut[0]].fit.x, globalVariables.allCuts[globalVariables.hightlightedCut[0]].fit.y, globalVariables.allCuts[globalVariables.hightlightedCut[0]].w, globalVariables.allCuts[globalVariables.hightlightedCut[0]].h, globalVariables.hightlightedCut[0], "allCuts", !1, !0, globalVariables.hightlightedCut[1]),
  drawCut(globalVariables.allCuts[e].fit.x, globalVariables.allCuts[e].fit.y, globalVariables.allCuts[e].w, globalVariables.allCuts[e].h, e, "allCuts", !0, !1, a),
  globalVariables.hightlightedCut = [e, a];
  for (var l = document.getElementsByClassName("cut-information"), t = l[a], i = 0; i < l.length; )
      l[i].innerHTML = "",
      i++;
  if ("" != globalVariables.allCuts[e].name)
      var s = "Cut name: " + globalVariables.allCuts[e].name + ",";
  else
      s = "";
  t.innerHTML = s + " Cut number: " + globalVariables.allCuts[e].number + ", Width: " + (globalVariables.allCuts[e].w - globalVariables.bladeWidth) + ", Height: " + (globalVariables.allCuts[e].h - globalVariables.bladeWidth) + ", West cut position: " + globalVariables.allCuts[e].fit.x.toFixed(1) + ", East cut position: " + (globalVariables.allCuts[e].fit.x - globalVariables.bladeWidth + globalVariables.allCuts[e].w).toFixed(1) + ", North cut position: " + globalVariables.allCuts[e].fit.y.toFixed(1) + ", South cut position: " + (globalVariables.allCuts[e].fit.y + -globalVariables.bladeWidth + globalVariables.allCuts[e].h).toFixed(1),
  console.log("Hit index:" + globalVariables.allCuts[e].index + " x:" + globalVariables.allCuts[e].fit.x + " y:" + globalVariables.allCuts[e].fit.y + " w:" + globalVariables.allCuts[e].w + " h:" + globalVariables.allCuts[e].h + " , proportion:" + globalVariables.allCuts[e].proportion)
}
function drawCutLines(e, a, l, t, i, s, o, r) {
  var n = globalVariables.sheet[r].divider;
  height = t * n,
  width = l * n,
  e *= n,
  a *= n,
  globalVariables.lineCanvas[r].lineWidth = Math.ceil(globalVariables.bladeWidth * n),
  globalVariables[s][i].edge && globalVariables[s][i].edge.right === !0 ? width = (l - globalVariables.bladeWidth) * n : (globalVariables.lineCanvas[r].strokeStyle = globalVariables.colours.cutLine,
  globalVariables.lineCanvas[r].beginPath(),
  globalVariables.lineCanvas[r].moveTo(e + Math.ceil(width) - globalVariables.lineCanvas[r].lineWidth / 2, a),
  globalVariables.lineCanvas[r].lineTo(e + Math.ceil(width) - globalVariables.lineCanvas[r].lineWidth / 2, a + height),
  globalVariables.lineCanvas[r].stroke()),
  globalVariables[s][i].edge && globalVariables[s][i].edge.bottom === !0 ? height = (t - globalVariables.bladeWidth) * n : (globalVariables.lineCanvas[r].beginPath(),
  globalVariables.lineCanvas[r].moveTo(e, a + height - globalVariables.lineCanvas[r].lineWidth / 2),
  globalVariables.lineCanvas[r].lineTo(e + width, a + height - globalVariables.lineCanvas[r].lineWidth / 2),
  globalVariables.lineCanvas[r].stroke()),
  0 !== a && (globalVariables.lineCanvas[r].beginPath(),
  globalVariables.lineCanvas[r].moveTo(e, a - globalVariables.lineCanvas[r].lineWidth / 2),
  globalVariables.lineCanvas[r].lineTo(e + width, a - globalVariables.lineCanvas[r].lineWidth / 2),
  globalVariables.lineCanvas[r].stroke())
}
function drawFreeSpace() {
  for (var e = 0; e < globalVariables.offCuts.length; ) {
      for (var a = 0; a < globalVariables.offCuts[e].length; )
          draw(globalVariables.offCuts[e][a]),
          a++;
      e++
  }
}
function draw(e) {
  var a = globalVariables.sheet[e.sheet].divider;
  height = e.h * a,
  width = e.w * a,
  x = e.x * a,
  y = e.y * a,
  globalVariables.cutCanvas[e.sheet].fillStyle = globalVariables.colours.offCuts,
  globalVariables.cutCanvas[e.sheet].fillRect(x, y, width, height),
  globalVariables.cutCanvas[e.sheet].strokeStyle = "grey",
  globalVariables.cutCanvas[e.sheet].lineWidth = 1,
  globalVariables.cutCanvas[e.sheet].strokeRect(x, y, width, height),
  globalVariables.cutCanvas[e.sheet].fill(),
  "undefined" != typeof label && (globalVariables.cutCanvas[e.sheet].beginPath(),
  globalVariables.cutCanvas[e.sheet].fillStyle = globalVariables.colours.text,
  globalVariables.cutCanvas[e.sheet].font = globalVariables.colours.labelFontSize + "px Arial",
  globalVariables.cutCanvas[e.sheet].textAlign = "center",
  globalVariables.cutCanvas[e.sheet].fillText(label, x + width / 2, y + height / 2 + globalVariables.colours.labelFontSize / 2 - 2),
  globalVariables.cutCanvas[e.sheet].fill())
}
function showDidNotFit(e) {
  var a = document.getElementsByClassName("cut message");
  if (globalVariables.didNotFit.length > 0) {
      globalVariables.didNotFit.sort(sortNumber);
      for (var l = 0, t = 0, i = globalVariables.didNotFit[0].number; l < globalVariables.didNotFit.length; )
          i == globalVariables.didNotFit[l].number ? (i = globalVariables.didNotFit[l].number,
          t++) : (a[globalVariables.didNotFit[l - 1].number - 1].innerHTML = '<img src="./images/up-arrow.svg" class="up-arrow">' + t + " did not fit",
          t = 1,
          i = globalVariables.didNotFit[l].number),
          l++;
      var s = document.createElement("div");
      if (a[globalVariables.didNotFit[l - 1].number - 1].innerHTML = '<img src="./images/up-arrow.svg" class="up-arrow">' + t + " did not fit",
      1 == globalVariables.autoAddNewSheets && 1 != e) {
          if (0 == globalVariables.autoSheetCreated) {
              var o = document.getElementById("auto-sheet-width")
                , r = document.getElementById("auto-sheet-length");
              if ("sheet" == globalVariables.mode && isNaN(parseFloat(o.value)) || isNaN(parseFloat(r.value)) || "linear" == globalVariables.mode && isNaN(parseFloat(r.value)))
                  return showMessage("Please enter some measurements into the auto sheet fields, which are now hightlighted"),
                  o.style.backgroundColor = "yellow",
                  void (r.style.backgroundColor = "yellow");
              o.style.backgroundColor = "white",
              r.style.backgroundColor = "white",
              createSheetInput(!0, o.value, r.value),
              globalVariables.autoSheetCreated = !0
          } else {
              var n = parseFloat(document.getElementById("auto-sheet-quantity").value);
              document.getElementById("auto-sheet-quantity").value = n + 1
          }
          reset(),
          getCuts("sheet" == globalVariables.mode ? globalVariables.winningStrategy : "linear")
      }
  }
}
function reverseOrientation(e) {
  i = 0,
  length = globalVariables[e].length;
  for (var a; i < length; )
      a = [globalVariables[e][i].w, globalVariables[e][i].h],
      globalVariables[e][i].w = a[1],
      globalVariables[e][i].h = a[0],
      i++
}
function checkFitInUnusedNodes(e) {
  console.count("checkFitInUnusedNodes triggered");
  var a = 0, l;
  for (globalVariables.unusedNodes.sort(sortIndexDesc); a < globalVariables.unusedNodes.length; ) {
      globalVariables.space.w = globalVariables.unusedNodes[a].w,
      globalVariables.space.h = globalVariables.unusedNodes[a].h,
      l = new packingAlgorithm(globalVariables.unusedNodes[a].w,globalVariables.unusedNodes[a].h,globalVariables.unusedNodes[a].x,globalVariables.unusedNodes[a].y,globalVariables.unusedNodes[a].sheet,globalVariables.unusedNodes[a].index),
      l.fit(globalVariables.didNotFit, globalVariables.unusedNodes[a].sheet, a, !0);
      var t = findUnusedNodes(globalVariables.unusedNodes[a]);
      globalVariables.unusedNodes.splice(a, 1),
      globalVariables.unusedNodes.sort(sortIndexDesc),
      1 == t && a--,
      a++
  }
}
function findUnusedNodes(e) {
  var a;
  return 1 != e.used ? e.h > 0 && e.w > 0 && globalVariables.unusedNodes.push(e) : (a = !0,
  findUnusedNodes(e.right),
  findUnusedNodes(e.down)),
  1 == a ? !0 : void 0
}
function mergeSpace(e, a, l, t, i) {
  e.h += a.h,
  e.area = e.h * e.w,
  globalVariables.unusedNodes[l].area = e.area,
  "delete" == i ? globalVariables.unusedNodes.splice(t, 1) : "merge" == i && (globalVariables.unusedNodes[t].w -= globalVariables.unusedNodes[l].w)
}
function displayAttribute(e, a, l) {
  if (a && l)
      for (var t = 0; t < e.length; )
          console.log(e[t][a][l]),
          t++;
  else
      for (var t = 0; t < e.length; )
          console.log(e[t][a]),
          t++
}
var globalVariables = {
  cutQueue: [],
  sheet: [],
  divider: 1,
  cutNumber: 1,
  sheetNumber: 1,
  currentSheet: 0,
  drawIndex: 0,
  index: 0,
  unCutMultiple: 0,
  hightlightedCutNumber: !1,
  nodeIndex: 0,
  edgeFlag: {
      bottom: !1,
      right: !1
  },
  colours: {
      sheet: "#cce6ff",
      cutFill: "#1a75ff",
      cutLine: "#cce6ff",
      text: "#ffffff",
      highlightFill: "#ff49ff",
      offCuts: "#ffd35d",
      labelFontSize: 14
  },
  remainingHeight: 0,
  remainingWidth: 0,
  didNotFit: [],
  preferences: {
      longitudinalCuts: !0
  },
  anotherPass: !0,
  space: {},
  algorithms: {
      algo1: !0,
      algo2: !0
  },
  cutCanvas: [],
  lineCanvas: [],
  offCuts: [],
  ripPriority: !1,
  crossCutPriority: !1,
  sheetRemainder: [],
  numberOfStrategies: 6,
  sheetWarningFired: !1,
  cutWarningFired: !1,
  mode: "sheet",
  messageAreaOpen: !1,
  autoAddNewSheets: !1,
  autoSheetCreated: !1,
  linearWidth: "",
  deferProportion: 4,
  helpShown: !0
};
createEventListeners();
var packingAlgorithm = function(e, a, l, t, i, s) {
  this.initialise(e, a, l, t, i, s)
};
packingAlgorithm.prototype = {
  initialise: function(e, a, l, t, i, s) {
      this.root = {
          x: l,
          y: t,
          w: e,
          h: a,
          sheet: i,
          index: s
      }
  },
  fit: function(e, a, l, t) {
      var i, s, o;
      for (globalVariables.didNotFit = [],
      i = 0; i < e.length; i++)
          if (o = e[i],
          0 != t || 1 != o.defer)
              if (s = this.findNode(this.root, o.w, o.h, a, o))
                  if ("6" == o.name,
                  1 == globalVariables.edgeFlag.right && 1 == globalVariables.edgeFlag.bottom) {
                      o.edge = {},
                      o.edge.right = !0,
                      o.edge.bottom = !0,
                      globalVariables.edgeFlag.right = !1,
                      globalVariables.edgeFlag.bottom = !1,
                      console.log("Index " + o.index + " on the bottom right - removing blade width from both sides");
                      var r = this.splitNode(s, o.w - globalVariables.bladeWidth + globalVariables.remainingWidth, o.h - globalVariables.bladeWidth + globalVariables.remainingHeight, a);
                      null != l && (globalVariables.unusedNodes[l] = this.root),
                      o.fit = r,
                      o.fit.w = o.w,
                      o.fit.h = o.h,
                      o.fit.sheet = globalVariables.currentSheet
                  } else if (1 == globalVariables.edgeFlag.bottom) {
                      o.edge = {},
                      o.edge.bottom = !0,
                      console.log("Index " + o.index + " on the bottom edge - removing blade width");
                      var r = this.splitNode(s, o.w, o.h - globalVariables.bladeWidth + globalVariables.remainingHeight, a);
                      null != l && (globalVariables.unusedNodes[l] = this.root),
                      o.fit = r,
                      o.fit.h = o.h,
                      o.fit.sheet = globalVariables.currentSheet
                  } else if (1 == globalVariables.edgeFlag.right) {
                      o.edge = {},
                      o.edge.right = !0;
                      var r = this.splitNode(s, o.w - globalVariables.bladeWidth + globalVariables.remainingWidth, o.h, a);
                      null != l && (globalVariables.unusedNodes[l] = this.root),
                      o.fit = r,
                      o.fit.w = o.w,
                      o.fit.sheet = globalVariables.currentSheet
                  } else {
                      var r = this.splitNode(s, o.w, o.h, a);
                      null != l && (globalVariables.unusedNodes[l] = this.root),
                      o.fit = r,
                      o.fit.sheet = globalVariables.currentSheet
                  }
              else
                  globalVariables.didNotFit.unshift(o);
          else
              globalVariables.didNotFit.push(o);
      if (1 == globalVariables.anotherPass) {
          if (console.count("second pass triggered"),
          globalVariables.anotherPass = !1,
          globalVariables.unusedNodes = [],
          findUnusedNodes(this.root),
          globalVariables.findEmptyNodesRun = !0,
          1 == globalVariables.algorithms.algo1 || "linear" == globalVariables.mode) {
              console.count("algo 1 triggered");
              for (var n = 0, b, g; n < globalVariables.unusedNodes.length; ) {
                  b = n + 1;
                  e: for (; b < globalVariables.unusedNodes.length && !(globalVariables.unusedNodes[n].y + globalVariables.unusedNodes[n].h < globalVariables.unusedNodes[b].y) && !(globalVariables.unusedNodes[n].x < globalVariables.unusedNodes[b].x); ) {
                      if (globalVariables.unusedNodes[n].x == globalVariables.unusedNodes[b].x)
                          mergeSpace(globalVariables.unusedNodes[n], globalVariables.unusedNodes[b], n, b, "delete"),
                          b--;
                      else {
                          if (!(globalVariables.unusedNodes[n].x > globalVariables.unusedNodes[b].x))
                              break;
                          mergeSpace(globalVariables.unusedNodes[n], globalVariables.unusedNodes[b], n, b, "merge")
                      }
                      b++
                  }
                  n++
              }
              0 == a && (globalVariables.algo1UnusedNodes = globalVariables.unusedNodes),
              checkFitInUnusedNodes(a),
              reverseOrientation("didNotFit"),
              checkFitInUnusedNodes(a),
              globalVariables.offCuts.push(globalVariables.unusedNodes)
          }
          if ("sheet" == globalVariables.mode && globalVariables.didNotFit.length > 0 && 1 == globalVariables.algorithms.algo2) {
              console.count("algo 2 triggered");
              var d = 0, u;
              for (n = 0; n < globalVariables.unusedNodes.length; )
                  globalVariables.unusedNodes[n].x > d && d < globalVariables.sheet[globalVariables.currentSheet].w && (d = globalVariables.unusedNodes[n].x,
                  maxXHeight = globalVariables.unusedNodes[n].h),
                  n++;
              globalVariables.unusedNodes = [],
              globalVariables.unusedNodes.push({
                  index: 0,
                  h: maxXHeight,
                  w: globalVariables.sheet[globalVariables.currentSheet].w - d,
                  x: d,
                  y: 0,
                  area: globalVariables.sheet[globalVariables.currentSheet].h * globalVariables.sheet[globalVariables.currentSheet].w - d,
                  sheet: a
              }),
              checkFitInUnusedNodes(a)
          }
      }
      0 == globalVariables.algorithms.algo1 && 0 == globalVariables.algorithms.algo2 && globalVariables.offCuts.push(globalVariables.unusedNodes)
  },
  findNode: function(e, a, l, t, i) {
      return e.used ? 1 != globalVariables.crossCutPriority && "sheet" == globalVariables.mode ? this.findNode(e.right, a, l, t, i) || this.findNode(e.down, a, l, t, i) : this.findNode(e.down, a, l, t, i) || this.findNode(e.right, a, l, t, i) : a <= e.w && l <= e.h ? e : e.x + e.w >= globalVariables.sheet[t].w && e.w > 0 || e.y + e.h >= globalVariables.sheet[t].h && e.h > 0 ? e.y + e.h == globalVariables.sheet[t].h && l > e.h && e.x + e.w == globalVariables.sheet[t].w && a > e.w ? l - globalVariables.bladeWidth <= e.h && a - globalVariables.bladeWidth <= e.w ? (globalVariables.edgeFlag.bottom = !0,
      globalVariables.edgeFlag.right = !0,
      globalVariables.remainingWidth = e.w - (a - globalVariables.bladeWidth),
      globalVariables.remainingHeight = e.h - (l - globalVariables.bladeWidth),
      e) : void 0 : e.x + e.w >= globalVariables.sheet[t].w && a > e.w && a - globalVariables.bladeWidth <= e.w && l <= e.h ? (globalVariables.edgeFlag.right = !0,
      globalVariables.remainingWidth = e.w - (a - globalVariables.bladeWidth),
      e) : e.y + e.h >= globalVariables.sheet[t].h && l > e.h && l - globalVariables.bladeWidth <= e.h && a <= e.w ? (globalVariables.edgeFlag.bottom = !0,
      globalVariables.remainingHeight = e.h - (l - globalVariables.bladeWidth),
      e) : null : null
  },
  splitNode: function(e, a, l, t, i) {
      return 1 == globalVariables.edgeFlag.right && (globalVariables.edgeFlag.right = !1),
      1 == globalVariables.edgeFlag.bottom && (globalVariables.edgeFlag.bottom = !1),
      e.used = !0,
      globalVariables.nodeIndex++,
      1 != globalVariables.crossCutPriority && "sheet" == globalVariables.mode ? (e.down = {
          x: e.x,
          y: e.y + l,
          w: e.w,
          h: e.h - l,
          index: globalVariables.nodeIndex,
          sheet: t
      },
      globalVariables.nodeIndex++,
      e.right = {
          x: e.x + a,
          y: e.y,
          w: e.w - a,
          h: l,
          index: globalVariables.nodeIndex,
          sheet: t
      }) : (e.down = {
          x: e.x,
          y: e.y + l,
          w: a,
          h: e.h - l,
          index: globalVariables.nodeIndex,
          sheet: t
      },
      globalVariables.nodeIndex++,
      e.right = {
          x: e.x + a,
          y: e.y,
          w: e.w - a,
          h: e.h,
          index: globalVariables.nodeIndex,
          sheet: t
      }),
      e
  }
},
createSheetInput(),
createCutInput();

const KEYS = ['dropDownData', 'inputData', 'numberOfCuts', 'numberOfSheets', 'originalWidths', 'mode']

function dump (name) {
  save()
  const payload = {}
  for (const key of KEYS) {
    payload[key] = localStorage.getItem(key)
  }
  localStorage.setItem('save-' + name, JSON.stringify(payload))
}

function load (name) {
  const payload = JSON.parse(localStorage.getItem('save-' + name))
  for (const key of Object.keys(payload)) {
    localStorage.setItem(key, payload[key])
  }
  recall()
}
