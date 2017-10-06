var selectedFolderId;
var selectedProjectId;
var newFolderDiv;
var filesUploadPage = 'FileNew.aspx';
var folderActions;
var projectFolderActions;
var baseUrl;

// "constants"
var TOOLBAR_PROJECT = 1;
var TOOLBAR_FOLDER = 2;
var TOOLBAR_EMPTY = 3;

$(document).ready(function () {
  $(".CollapseImg").hover(
    function () { $(this).attr("src", baseUrl + "/Images/CollapseHot.png"); },
    function () { $(this).attr("src", baseUrl + "/Images/Collapse.png"); }
  );

  $(".MenuTable tr").hover(
    function () { $(this).addClass("MenuTrHilite"); },
    function () { $(this).removeClass("MenuTrHilite"); }
  );

  initFolderBehaviors(".Folder");

  $("#txtSearch").keypress(search_onKeyPress);

  $("#divBlank").height($(window).height() - 225);

  $("#divBlank").click(function () {
    deselectFolder();
  });

  $("#trFoldersBar").bind("click", function (e) {
    if ($("#divFolders div[folderId='" + selectedFolderId + "']").length > 0) {
      $("#divMenu").show().css({ left: ($("#divLeft").width() - 120) + "px", top: "145px", position: "absolute" });
    } else {
      $("#divFoldersMenu").show().css({ left: ($("#divLeft").width() - 120) + "px" });
    }
    return false;
  });

  // element caching
  projectFolderActions = $("#project-folder-actions");
  folderActions = $("#folder-actions");

  $(document).bind("click", function () {
    $("#divFoldersMenu").hide();
  });
});

function addFile() {

  if (selectedFolderId == "new") { selectedFolderId = $(newFolderDiv).attr("folderId"); }

  if (selectedFolderId === undefined || selectedFolderId === null || selectedFolderId === "") {
    alert("Could not add a file. Please select a folder first.");
  } else if (selectedFolderId === "new") {
    alert("The folder has not finished uploading yet. Please re-select the folder and try again.");
  } else {

    openWin(filesUploadPage + '?fid=' + selectedFolderId + '&TID=' + selectedProjectId, 575, 420, 'FileNew', 'no');
  }
}

function addFolder_finished(result) {
  if (result == "ERROR") {
    alert("The folder \"" + $("div[folderId='new'] span").text() + "\" did not save successfully.");
    $(newFolderDiv).remove();
  } else {
    $(newFolderDiv).attr("folderId", result);
    if (selectedFolderId == "new" || selectedFolderId == null) {

      // Mark the newly created folder as selected. We can just call folder_click here.
      folder_click(newFolderDiv, true);

    }
    setToolbar(TOOLBAR_FOLDER);
  }
}

function blurFolder() {
  var oldElement;

  if (selectedFolderId == "new") {
    selectedFolderId = $(newFolderDiv).attr("folderId");
  }

  oldElement = $("div[folderId='" + selectedFolderId + "']");

  $(oldElement).addClass("Folder").removeClass("FolderHilite");
  $(oldElement).removeContextMenu();
}

function checkExpand(folderId) {
  var $divParent = $("#divFolders div[folderId='" + folderId + "']");

  if ($("div[parentFolderId='" + folderId + "'] div").length == 0 && $("div[folderId='" + folderId + "'] .ExpandImg").length > 0) {
    $("div[folderId='" + folderId + "'] .ExpandImg, div[parentFolderId='" + folderId + "']").remove();
    $divParent.css("padding-left", parseInt($("div[folderId='" + folderId + "']").css("padding-left").split("px")[0]) + 21);
  } else if ($("div[parentFolderId='" + folderId + "'] div").length > 0 && $("div[folderId='" + folderId + "'] .ExpandImg").length == 0) {
    $divParent.prepend("<img class='ExpandImg' onClick='expand_click(&quot;" + selectedFolderId + "&quot;);' src='" + baseUrl + "/Images/expanded.png' alt='' title='' />");
  }
}

function closeAddFile() {
  $(document.body).removeWhiteOut();
  $.browser.msie ? $("#divAddFile").css("display", "none") : $("#divAddFile").fadeOut("fast");
}

function deleteFolder() {
  if (selectedFolderId == "new") {
    selectedFolderId = $(newFolderDiv).attr("folderId");
  }

  var selFolder = $("div[folderId='" + selectedFolderId + "']");
  var selFolderId = $(selFolder).attr("folderid");

  if (confirm('Are you sure you want to delete the folder "' + selFolder.find("span").text() + '" and all of its contents?\n\nPlease note that deleting a folder will also remove:\n- All files within the folder\n- All subdirectories\n- All files within subdirectories')) {

    if (selFolderId == 'new') {
      alert('Unable to delete folder. The folder you are trying to delete may not have finished saving. Please wait for this operation to finish and try again.');
    } else {

      $("div[folderId='" + selFolderId + "'], div[parentFolderId='" + selFolderId + "']").hide('fast', function () { eval('$("div[folderId=\'' + selFolderId + '\'], div[parentFolderId=\'' + selFolderId + '\']").remove(); checkExpand("' + $("div[folderId='" + selFolderId + "']").parent().attr("parentFolderId") + '");'); });

      // set the toolbar
      setToolbar(TOOLBAR_PROJECT);

      PageMethods.DeleteFolder(selFolderId, selectedProjectId);

      // hide the files grid in the right-side pane of the page
      $("#grdFiles").toggle();

    }

  }
}

function deselectFolder() {
  triggerOnBlur(true);
  blurFolder();
  selectedFolderId = null;
  $("#hdnFolderID").val("");
  setToolbar(TOOLBAR_PROJECT);
}

function downloadFolder() {
  if (selectedFolderId == "new") {
    selectedFolderId = $(newFolderDiv).attr("folderId");
  }

  if (selectedFolderId != "new") {
    $("#hdnFolderID").val(selectedFolderId);
    __doPostBack('btnDownloadFolder', '');
  }
}

function edit_onBlur(element) {
  var $selFolder = $("#divFolders div[folderId='" + selectedFolderId + "']");
  var $selFolderSpan = $selFolder.find("span");

  // Ensure the uniqueness of the folder name within the parent folder
  var folderNames = [];
  $selFolder.siblings().find("> span").each(function () {
    folderNames.push($(this).text().toLowerCase());
  });

  var newFolderName = getUniqueFolderName($(element).val(), folderNames);

  $(element).hide();
  $selFolderSpan.text(newFolderName).show();
  $(element).remove();

  if (selectedFolderId == "new") {
    if ($(newFolderDiv).parent().attr("parentFolderId")) {
      PageMethods.AddFolder(newFolderName, $(newFolderDiv).parent().attr("parentFolderId"), selectedProjectId, addFolder_finished);
    } else {
      PageMethods.AddFolder(newFolderName, "", selectedProjectId, addFolder_finished);
    }
  } else {
    PageMethods.RenameFolder(newFolderName, selectedFolderId, selectedProjectId, renameFolder_finished);
  }

  $("div[folderId='" + selectedFolderId + "']").addContextMenu({
    menuSelector: "#divMenu",
    closerSelector: "#divLeft div.Folder, #divLeft, #divMenu, #divFolders div.ProjectsRow, #divRight",
    hideSelector: "#divFoldersMenu, #divFileActions"
  });
}

function edit_onKeyPress(e) {
  var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
  if (keyCode == 13) {
    triggerOnBlur(true);
    return false;
  } else {
    return true;
  }
}

function expand_click(folderId, callback) {
  var targetDiv = $("div[parentFolderId='" + folderId + "']");

  if (targetDiv && targetDiv.length > 0) {

    if ($(targetDiv).is(":visible")) {
      $("div[folderId='" + folderId + "'] .ExpandImg").attr("src", "../../../Images/collapsed.png");
      $(targetDiv).hide("fast", callback);
    } else {
      $("div[folderId='" + folderId + "'] .ExpandImg").attr("src", "../../../Images/expanded.png");
      $(targetDiv).tdShow("fast", callback);
      $(targetDiv).removeAttr("filter");
    }

  }

}

function folder_click(element, addContextMenu) {

  if (addContextMenu == null) { addContextMenu = true; }
  if ($(element).attr("folderId") != selectedFolderId) {
    deselectFolder();

    selectedFolderId = $(element).attr("folderId");

    $(element).addClass("FolderHilite").removeClass("Folder FolderHot");
    setToolbar(TOOLBAR_FOLDER);

    if (addContextMenu) {
      $(element).addContextMenu({
        menuSelector: "#divMenu",
        closerSelector: "#divLeft div.Folder, #divLeft, #divMenu, #divFolders div.ProjectsRow, #divRight",
        hideSelector: "#divFoldersMenu, #divFileActions"
      });
    }

    if (selectedFolderId == "new") {
      $("#grdFiles").css("display", "none");
    } else {
      getFiles();

      // Attempt to expand any child folders
      expand_click($(element).attr("folderId"));
    }
  } else {
    if (selectedFolderId != "new") {
      getFiles();

      // Attempt to expand any child folders
      expand_click($(element).attr("folderId"));

    }
  }
}

function getFiles() {
  if ($("#hdnFolderID").val() != selectedFolderId) {
    $("#hdnFolderID").val(selectedFolderId);
  }
  __doPostBack('btnGetFiles', '');
}

function initFolderBehaviors(selector) {
  if (selector == null) {
    selector = ".Folder";
  }

  $(selector).live("mouseenter", function () { $(this).addClass("FolderHot"); })
    .live("mouseleave", function () { $(this).removeClass("FolderHot"); });
}

function refreshBriefcase(folderId) {
  if (folderId != null) {
    deselectFolder();
    folder_click($("div[folderId='" + folderId + "']"));
  } else {
    __doPostBack('btnGetFiles', '');
  }
}

function renameFolder_finished(result) {
  if (typeof result != 'undefined' && result != "") {
    var resultSplit = result.split(":");
    var element = $("div[folderId='" + resultSplit[0] + "']");
    if (element.length > 0) {
      alert('There was a problem renaming the "' + $("span", element).text() + '" folder.');
      if (resultSplit.length > 1) {
        $("span", element).text(result.split(":")[1]);
      }
    } else {
      alert('There was a problem renaming the folder.');
    }
  }
}

function search_onKeyPress(e) {
  var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
  if (keyCode == 13) {
    deselectFolder();
    __doPostBack('btnSearch', '');
    return false;
  } else {
    return true;
  }
}

function startEdit() {
  var element = $("div[folderId='" + selectedFolderId + "'] span");
  $(element).parent().removeContextMenu();
  $(element).hide();
  $(element).after("<input type='text' class='TDTextBox' value='" + $(element).text() + "' onblur='edit_onBlur(this);' onkeypress='return edit_onKeyPress(event);' />");
  $("div[folderId='" + selectedFolderId + "'] input").focus().select();

  if (selectedFolderId === "new") {
    setToolbar(TOOLBAR_EMPTY);
  }
}

function startNewFolder(isRoot) {
  if (isRoot == null) { isRoot = false; }

  if (selectedFolderId == "new") {
    selectedFolderId = $(newFolderDiv).attr("folderId");
  }

  var parentFolderDiv = $("div[folderId='" + selectedFolderId + "']");
  var subFolderDiv = $("div[parentFolderId='" + selectedFolderId + "']");

  var parentProjId = 0;
  if (parentFolderDiv.attr("parProjId") != null) {
    parentProjId = parentFolderDiv.attr("parProjId");
  } else {
    var firstFolderDiv = $("#divFolders div.Folder:first");
    if (firstFolderDiv.length > 0) {
      parentProjId = firstFolderDiv.attr("parProjId");
    }
  }

  // Make sure the name of the new folder is unique within the parent
  var folderNames = [];
  var siblingFolders;
  var newFolderName = 'New Folder';

  if (isRoot) {
    siblingFolders = $("#divFolders > div > div[parProjId='" + parentProjId + "'] > span");
  } else {
    siblingFolders = $("#divFolders div[parentFolderId='" + selectedFolderId + "'] span");
  }

  siblingFolders.each(function () {
    folderNames.push($(this).text().toLowerCase());
  });

  var newFolderName = getUniqueFolderName('New Folder', folderNames)
  var newFolderHtml = "<div folderId='new' parProjId='" + parentProjId + "'onClick='folder_click(this);' class='Folder' style='padding-left: {0}px;'><img src='../../../Images/folder_16.png' class='FolderIcon' style='border: 0px; vertical-align: middle;' alt='' title='' /><span>" + newFolderName + "<img class='AjaxImg' src='../../../Images/ajax-loader.gif' alt='' title='' style='display: none;' /></span></div>";
  var newPadding;

  if (isRoot) {
    newPadding = 21;

    $("#divFolders > div").prepend(newFolderHtml.replace("{0}", newPadding));

    folder_click($("div[folderId='new']"));
    startEdit();

    newFolderDiv = $("div[folderId='new']");
    initFolderBehaviors("div[folderId='new']");
  } else {
    if (subFolderDiv.length > 0) {
      // we have a sub-folder section already
      newPadding = (parseInt($(parentFolderDiv).css("padding-left").split("px")[0]) + 39)

      if (!$(subFolderDiv).is(":visible")) {
        expand_click(selectedFolderId, function () { eval('$("div[parentFolderId=\'' + selectedFolderId + '\']").prepend("' + newFolderHtml.replace("{0}", newPadding) + '");folder_click($("div[folderId=\'new\']")); startEdit();newFolderDiv = $("div[folderId=\'new\']"); initFolderBehaviors("div[folderId=\'new\']");'); });
      } else {
        subFolderDiv.prepend(newFolderHtml.replace("{0}", newPadding));

        folder_click($("div[folderId='new']"));
        startEdit();

        newFolderDiv = $("div[folderId='new']");
        initFolderBehaviors("div[folderId='new']");
      }
    } else {
      // we need a sub-folder section
      newPadding = (parseInt($(parentFolderDiv).css("padding-left").split("px")[0]) + 18)

      parentFolderDiv.css("padding-left", parseInt(parentFolderDiv.css("padding-left").split("px")[0]) - 21);
      parentFolderDiv.prepend("<img class='ExpandImg' onClick='expand_click(&quot;" + selectedFolderId + "&quot;);' src='../../../Images/expanded.png' alt='' title='' />");
      parentFolderDiv.after("<div parentFolderId='" + selectedFolderId + "'>" + newFolderHtml.replace("{0}", newPadding) + "</div>");

      folder_click($("div[folderId='new']"));
      startEdit();

      newFolderDiv = $("div[folderId='new']");
      initFolderBehaviors("div[folderId='new']");
    }
  }
}

function startNewRootFolder() {
  startNewFolder(true);
}

function triggerOnBlur(includeMsie) {
  if (includeMsie == null) { includeMsie = false; }
  if ((includeMsie || !$.browser.msie) && $("div[folderId='" + selectedFolderId + "'] input").length > 0) {
    if (selectedFolderId == "new") {
      $("input", newFolderDiv).trigger('onblur');
    } else {
      $("div[folderId='" + selectedFolderId + "'] input").trigger('onblur');
    }
  }
}

/*
 *  Gets a unique folder name within the collection of folders.
 *  The folders list should contain lowercase names.
 */
function getUniqueFolderName(folderName, folders) {

  var folderCount = 1;
  while ($.inArray(folderName.toLowerCase(), folders) != -1) {

    var digitRegex = /^.*\((\d+)\).*$/g;
    var match = digitRegex.exec(folderName);

    if (match != null) {

      folderCount = parseInt(match[1]);
      folderName = folderName.replace('(' + folderCount + ')', '(' + (folderCount + 1) + ')');
      folderCount++;

    } else {
      folderCount++;
      folderName += ' (' + folderCount + ')';
    }

  }

  return folderName;
}

/*
*  Sets the toolbar UI based on the mode (use TOOLBAR_PROJECT or TOOLBAR_FOLDER "constants")
*/
function setToolbar(toolBarMode) {
  if (toolBarMode == TOOLBAR_FOLDER) {
    projectFolderActions.hide();
    folderActions.show();
  } else if (toolBarMode == TOOLBAR_PROJECT) {
    projectFolderActions.show();
    folderActions.hide();
  } else if (toolBarMode === TOOLBAR_EMPTY) {
    projectFolderActions.hide();
    folderActions.hide();
  }
}

function initFileBehaviors() {
  // set up click events for rows in the grdFiles table
  $("#grdFiles tr:gt(0)").removeContextMenu();
  $("#grdFiles tr:gt(0)").addContextMenu({
    menuSelector: "#divFileActions",
    closerSelector: "#divLeft div.Folder, #divLeft, #divMenu, #divFolders div.ProjectRow, #divRight",
    hideSelector: "#divFoldersMenu, #divMenu"
  });

  $("#grdFiles tr:gt(0)").bind("contextmenu", function () {
    setFileContextMenu(this);
  });
}

function setFileContextMenu(row) {

  var oFile = $(row),
  projectID = 0,
  selectedFileId = '',
  contextMenu = $("#divFileActions"),
  allButtons = $("#btnOpenFile,#btnDownloadFile,#btnDeleteFile,#btnRenameFile"),
  btnOpenFile = $("#btnOpenFile"),
  btnDownloadFile = $("#btnDownloadFile"),
  btnDeleteFile = $("#btnDeleteFile"),
  btnRenameFile = $("#btnRenameFile"),

  // Set up permissions
  projectID = oFile.attr("tid");
  selectedFileId = oFile.attr("id");

  // Hide actions by default
  allButtons.unbind("click");
  allButtons.hide();

  // Highlight the selected row
  $("#grdFiles tr:gt(0)").removeClass("hilite");
  oFile.addClass("hilite");
  lastRow = oFile; // this sets the variable in RowHighlight.js so that selecting another datagrid row manually will remove the last highlight.

  /* Set up button visiblity and actions */
  // Open, Download
  btnOpenFile.click(function () { openWin('FileDet.aspx?TID=' + projectID + '&fid=' + selectedFileId, 850, 700, 'TDExplorer'); contextMenu.hide(); });
  btnOpenFile.show();

  btnDownloadFile.click(function () { window.location.href = 'FileOpen.aspx?D=1&TID=' + projectID + '&fid=' + selectedFileId; contextMenu.hide(); });
  btnDownloadFile.show();

  // Delete file
  btnDeleteFile.click(function () {
    var shouldDelete = confirm('Delete this file? This cannot be undone.');
    if (shouldDelete) {
      PageMethods.DeleteFile(projectID, selectedFileId, deleteFile_Success, deleteFile_Error);
    }
    contextMenu.hide();
  });

  btnDeleteFile.show();

  // Rename file
  btnRenameFile.click(function () { openWin('FileRename.aspx?TID=' + projectID + '&fid=' + selectedFileId + '&RefreshExplorerOnly=true', 650, 400, 'TemplatesFileDet', 'auto'); contextMenu.hide(); });
  btnRenameFile.show();

}

function deleteFile_Success(result) {

  $("#divFileActions").hide();

  if (result === true) {
    __doPostBack('btnGetFiles', '');
    alert('File deleted successfully.');
  } else {
    alert('The file could not be deleted.\n\nThe file may have been deleted already.');
  }

}

function deleteFile_Error(error) {
  $("#divFileActions").hide();
}

function cut() {
  // Make sure the user isn't trying to cut/paste a folder that hasn't yet been saved to the server. This can
  // happen if the folder was just created, and the server either experienced an error, or is just taking a few
  // seconds to respond with the folder's new ID.
  if (selectedFolderId !== 'new') {
    cutId = selectedFolderId;
    cutProjID = $("div[folderId = '" + cutId + "']").attr("parProjId");
    $("#menuPaste, #liPaste").show();
  } else {
    alert('This folder has not yet been saved to the server. Please wait a moment and try again.');
  }
}

function paste() {
  var targetFolder = $("#divFolders div[folderId='" + selectedFolderId + "']");
  var pasteProjID = targetFolder.attr("parProjId");
  var moveFoldersResult = moveFolders(cutId, selectedFolderId);

  if (moveFoldersResult.isSuccessful === true) {
    var currentCutFolderID = cutId;
    moveFolder(cutId, cutProjID, selectedFolderId, pasteProjID, null, function () {
      // Let the user know what's going on.
      alert('Folder paste failed.');

      // Move the folder back to where it belongs.
      moveFolders(currentCutFolderID, moveFoldersResult.previousParentId);
    });

    // We're done; reset everything
    $("#menuPaste, #liPaste").hide();
    cutId = null;

  } else {
    alert('You can only paste a folder into a different folder in the same project.');
  }
}

function moveFolders(folderId, newParentFolderId) {
  var moveFoldersResult = {
    isSuccessful: false,
    previousParentId: null
  };

  var folderToMove = $("#divFolders div[folderId='" + folderId + "']");
  var targetFolder = $("#divFolders div[folderId='" + newParentFolderId + "']");
  var folderProjId = $("div[folderId = '" + folderId + "']").attr("parProjId");
  var pasteProjID = targetFolder.attr("parProjId");

  // this line checks that 1) the paste is in the same project, 2) the paste is not onto the same folder as you are cutting,
  // and 3) that the paste is not into any child folder of the cut folder.
  if (pasteProjID == folderProjId && folderId != newParentFolderId && $("#divFolders div[parentFolderId='" + folderId + "'] div[folderId='" + newParentFolderId + "']").length == 0) {
    //first, we need to see if the target folder has a child folder container. if it doesn't, we need to create one
    var targetFolderContainer = $("#divFolders div[parentFolderId='" + newParentFolderId + "']");
    if (targetFolderContainer.length == 0) {
      //create the folder container
      targetFolderContainer = $("<div></div>").attr("parentFolderId", newParentFolderId);
      targetFolder.after(targetFolderContainer);
    }

    //we'll need the previous parent Id for later...
    var cutFolderParentId = $("#divFolders div[folderId='" + folderId + "']").parent("div").attr("parentFolderId");

    // Return the previous parent ID as a part of the result.
    moveFoldersResult.previousParentId = cutFolderParentId;

    //we need to ensure that the folder name will be unique in the destination folder
    var folderNames = [];
    targetFolder.next().children().find("> span").each(function () {
      folderNames.push($(this).text().toLowerCase());
    });

    var newFolderName = getUniqueFolderName(folderToMove.find("span").text(), folderNames)
    folderToMove.find("span").text(newFolderName);

    //next, we move the cut folder to the inside of the target folder's child folder container. we should do it in alpha order if we can
    var cutFolderStuff = $("#divFolders div[folderId='" + folderId + "'], #divFolders div[parentFolderId='" + folderId + "']");
    cutFolderStuff
      .remove()
      .appendTo(targetFolderContainer);

    //Check the old parent folder and the new parent folder's expand images' validity
    checkExpand(cutFolderParentId);
    checkExpand(newParentFolderId);

    //we need to set the padding on the folders which were pasted
    setPaddingRecursively(targetFolder);

    moveFoldersResult.isSuccessful = true;
  } else {
    moveFoldersResult.isSuccessful = false;
  }

  return moveFoldersResult;
}

function moveFolder(folderId, folderProjectId, newParentFolderId, newParentFolderProjectId, successCallback, errorCallback) {
  $.tdajax({
    url: baseUrl + 'Services/JSON/BriefcaseService.asmx/MoveFolder',
    data: JSON.stringify({
      folderID: folderId,
      folderProjectID: folderProjectId,
      newParentFolderID: newParentFolderId,
      newParentFolderProjectID: newParentFolderProjectId
    }),
    success: successCallback,
    error: errorCallback
  });
};

function setPaddingRecursively(startDiv) {
  //var startDiv = $('div[folderid="686afd59-252d-48d8-a1c4-358525ae1f0a"]')

  var $targetParentFolder = startDiv.parent();
  var targetChildrenFolders = $targetParentFolder.find('div[folderid]');
  var extraPadding;

  targetChildrenFolder.each(function() {
    var thisFolderId = $(this).attr('folderid');
    var siblingFolderId = $(this).next().attr('parentfolderid');

    if (thisFolderId === siblingFolderId) {
      // This is a parent folder. No new padding
      extraPadding = 0;
    }
    else {
      // Child folder, need to add padding
      extraPadding = 18;
    }

    // Setting padding
    var setPadding = parseInt($(this).css('padding-left').split('px')[0]) + extraPadding;
    $(this).css('padding-left', setPadding);
  });

}




































