/* This script is for automatically listing a player's notable losses and wins on the Notable W/L sheet.
 * To use this script, write an equals sign and the custom function's name in all caps (NOTABLEWL), and in parentheses with quotation marks write the cell's range. 
 * Here's an example-
 * =NOTABLEWL("E3")
 * This will print out the weekly in-state losses for the first player on the Notable W/L sheet. 
 * If you have any questions / suggestions, feel free to contact me (Reg / Jay) :)
*/

/* LIMITATIONS-
 * - No one can be named DQ.
 * - Player names cannot have spaces or commas. 
 * - Players obviously can't have the same name.
 * - Player names need to be consistent.
*/

/* [TODO]
 * CHECK IF PLAYER NAMES ARE CASE SENSITIVE
 * In the future, assign each player an ID instead of just using their name.
 * Not sure if each spreadsheet player should just have their own page, or if I can neatly organize/store all their info (start.gg user IDs, tags, etc)
*/


var callingCellColumn;
var callingCellRow;
var spreadsheet;
var currentSheet;
var playerBeingChecked;
var recordsTotalCellDataArray;
var notablePlayersParallelArray;
var playerRegionParallelArray;
var totalInStateArray;
var totalOutOfStateArray;
var callingCellRangeAsString;
var currentRowIndex;
var tournamentTypeBeingCheckedFor;


/**
 * @customfunction
 */
function NOTABLEWL(_callingCellRangeAsString)
{
  callingCellRangeAsString = _callingCellRangeAsString;
  callingCellColumn = callingCellRangeAsString.substr(0, callingCellRangeAsString.search(/[0-9]/));
  callingCellRow = callingCellRangeAsString.substr(callingCellRangeAsString.search(/[0-9]/), callingCellRangeAsString.length);
  gameResult = getGameResult();
  tournamentTypeBeingCheckedFor = getTournamentType();

  spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  currentSheet = SpreadsheetApp.setActiveSheet(spreadsheet.getSheetByName(notableWinLossSheetName));
  playerBeingChecked = setPlayerBeingChecked();

  if (playerBeingChecked == "")
  {//Player not found, exit early
    return "";
  }
  
  currentSheet = SpreadsheetApp.setActiveSheet(spreadsheet.getSheetByName(recordsSheetName));
  currentRowIndex = getRowOfPlayerNameOnRecordsSheet(playerBeingChecked);
  
  if (gameResult == GameResult.Loss)
  {//Wins are listed on the same row as a player's name, while losses are down a row.
    currentRowIndex++;
  }

  addToRecordsTotalCellDataArray();
  addToPlayerParallelArrays();
  addToTotalInAndOutOfStateArrays();
  
  //In-state data is the same row as the row of the player's name on the Notable W/L sheet
  if (notableWinLossRowStart % 2 == callingCellRow % 2)
  {
    return totalInStateArray.join(", ");
  }
  else
  {
    return totalOutOfStateArray.join(", ");
  }
}


function addToRecordsTotalCellDataArray()
{
  try
  {
    let currentTournamentColumn = recordsTournamentColumnStart;
    recordsTotalCellDataArray = new Array();

    //This loops adds to the recordsTotalCellDataArray if a tournament matches the type that's being looked for, and if the opponent's name is unique (DQs are also skipped).
    while (!currentSheet.getRange(currentTournamentColumn + recordsTournamentNameRowStart).isBlank())
    {
      let currentTournamentType = currentSheet.getRange(currentTournamentColumn + recordsTournamentTypeRow).getDisplayValue().toLowerCase();

      if ((tournamentTypeBeingCheckedFor == TournamentType.Weekly && currentTournamentType == weeklyIdentifier) 
       || (tournamentTypeBeingCheckedFor == TournamentType.Nonweekly && currentTournamentType != weeklyIdentifier))
      {
        let cellData = currentSheet.getRange(currentTournamentColumn + currentRowIndex).getDisplayValue();

        if (cellData != "")
        {
          let cellDataArray = cellData.split(", ");

          for (let i = 0; i < cellDataArray.length; i++)
          {
            if (cellDataArray[i] != disqualificationIdentifier 
             && !recordsTotalCellDataArray.includes(cellDataArray[i]))
            {
              recordsTotalCellDataArray.push(cellDataArray[i]);
            }
          }
        }
      }

    currentTournamentColumn = getNextKey(currentTournamentColumn);
    }
  }
  catch (error){ throw new Error(error); }
}

function addToPlayerParallelArrays()
{
  notablePlayersParallelArray = new Array();
  playerRegionParallelArray = new Array();

  try
  {
    currentSheet = SpreadsheetApp.setActiveSheet(spreadsheet.getSheetByName(fullPlayerListSheetName));
    currentRowIndex = fullPlayerListRowStart;

    while(!currentSheet.getRange(fullPlayerListPlayerNameColumn + currentRowIndex).isBlank())
    {
      let cellData = currentSheet.getRange(fullPlayerListPlayerNameColumn + currentRowIndex).getDisplayValue();

      if (gameResult == GameResult.Win)
      {
       if (currentSheet.getRange(fullPlayerListNotableWinColumn + currentRowIndex).getDisplayValue() == notableWinYesIdentifier)
       {
         notablePlayersParallelArray.push(cellData);
         playerRegionParallelArray.push(currentSheet.getRange(fullPlayerListRegionColumn + currentRowIndex).getDisplayValue());
       }
      }
      else
      {
        notablePlayersParallelArray.push(cellData);
        playerRegionParallelArray.push(currentSheet.getRange(fullPlayerListRegionColumn + currentRowIndex).getDisplayValue());
      }

      currentRowIndex++;
    }
  }
  catch(error) { throw new Error(error); }
}

function addToTotalInAndOutOfStateArrays()//nearly duplicate code with the for loops. rewrite later
{
  try
  {
    totalInStateArray = new Array();
    totalOutOfStateArray = new Array();

    if (gameResult == GameResult.Win)
    {
      for (let i = 0; i < recordsTotalCellDataArray.length; i++)
      {
       if (notablePlayersParallelArray.includes(recordsTotalCellDataArray[i]))
       {
         if (playerRegionParallelArray[notablePlayersParallelArray.indexOf(recordsTotalCellDataArray[i])] == michigander)
         {
           totalInStateArray.push(recordsTotalCellDataArray[i]);
         }
         else
         {
           totalOutOfStateArray.push(recordsTotalCellDataArray[i]);
         }
       }
     }
    }
    else
    {
      for (let i = 0; i < recordsTotalCellDataArray.length; i++)
      {
        if (playerRegionParallelArray[notablePlayersParallelArray.indexOf(recordsTotalCellDataArray[i])] == michigander)
        {
          totalInStateArray.push(recordsTotalCellDataArray[i]);
        }
        else
        {
          totalOutOfStateArray.push(recordsTotalCellDataArray[i]);
        }
      }
    }
  }
  catch(error) { throw new Error(error); }
}

function getGameResult()
{
  try
  {
    if (callingCellColumn == notableWeeklyWinColumn 
     || callingCellColumn == notableNonweeklyWinColumn)
    {
      return GameResult.Win;
    }
    else if (callingCellColumn == notableWeeklyLossColumn 
        ||   callingCellColumn == notableNonweeklyLossColumn)
    {
      return GameResult.Loss;
    }
    else
    {
      throw new Exception("Calling cell column (" + callingCellColumn + ") couldn't be matched to the weekly win column (" + notableWeeklyWinColumn + "), nonweekly win column (" + notableNonweeklyWinColumn + "), weekly loss column (" + notableWeeklyLossColumn + ") or the nonweekly loss column (" + notableNonweeklyLossColumn + ")");
    }
  }
  catch (error){ throw new Error(error); }
}

function getTournamentType()
{
  try
  {
    if (callingCellColumn == notableWeeklyWinColumn 
     || callingCellColumn == notableWeeklyLossColumn)
    {
      return TournamentType.Weekly;
    }
    else if (callingCellColumn == notableNonweeklyWinColumn 
          || callingCellColumn == notableNonweeklyLossColumn)
    {
      return TournamentType.Nonweekly;
    }
    else
    {
      throw new Exception("Calling cell column (" + callingCellColumn + ") couldn't be matched to the weekly win column (" + notableWeeklyWinColumn + "), nonweekly win column (" + notableNonweeklyWinColumn + "), weekly loss column (" + notableWeeklyLossColumn + ") or the nonweekly loss column (" + notableNonweeklyLossColumn + ")");
    }
  }
  catch (error){ throw new Error(error); }
}

function setPlayerBeingChecked()
{
  try
  {
    if (callingCellRow % 2 == 0)
    {
      return currentSheet.getRange(notableWinLossPlayerNameColumn + (callingCellRow - 1)).getDisplayValue();
    }
    else
    {
      return currentSheet.getRange(notableWinLossPlayerNameColumn + callingCellRow).getDisplayValue();
    }
  }
  catch (error){ throw new Error(error); }
}

function getRowOfPlayerNameOnRecordsSheet(playerBeingSearchedFor)
{//This function assumes that player names take up two rows.
  try
  {
    let rowIndex = recordsPlayerNameRowStart;

    while (rowIndex <= currentSheet.getLastRow())
    {
      if (currentSheet.getRange(recordsPlayerColumn + rowIndex).getDisplayValue() == playerBeingSearchedFor)
      {
        return rowIndex;
      }
      else
      {
        rowIndex += 2;
      }
    }

    throw new Exception("Checked all rows and still couldn't find a match");
  }
  catch(error) { throw new Error(error); }
}
