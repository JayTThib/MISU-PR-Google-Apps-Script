function execute()//Run this function to perform the check
{
  const columnStart = 2;
  const rowStart = 2;
  const logSeparatorLine = "-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_";

  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var h2hSheet = SpreadsheetApp.setActiveSheet(sheet.getSheetByName("Head 2 Head"));

  var rowIndex = rowStart;
  var columnIndex = columnStart;
  var logStr = "";
  var incorrectCells = [""];
  var incorrectCellsStartIndex = 1;//skip first index cuz idk how to fucking declare a null string array in javascript that lets me use array.push()

  while (h2hSheet.getRange(rowIndex, 1).isBlank() == false)
  {
    var player1Name = h2hSheet.getRange(rowIndex, 1).getDisplayValue();

    Logger.log(logSeparatorLine);
    Logger.log("CHECKING " + player1Name);

    while(h2hSheet.getRange(1, columnIndex).isBlank() == false)
    {
      if (rowIndex == columnIndex)
      {
        logStr = "Self match - " + "CELL[" + rowIndex + "," + columnToLetter(columnIndex) + "]";
      }
      else
      {
        var player2Name = h2hSheet.getRange(1, columnIndex).getDisplayValue();
        var cell1DataString = h2hSheet.getRange(rowIndex, columnIndex).getDisplayValue();
        var cell1Wins = cell1DataString.slice(0, 1);
        var cell1Losses = cell1DataString.slice(2);

        logStr = player1Name + " VS " + player2Name + " (CELL[" + rowIndex + "," + columnToLetter(columnIndex) + "]-" + "[" + cell1Wins + "W " + cell1Losses + "L]) --- ";

        var cell2DataString = h2hSheet.getRange(columnIndex, rowIndex).getDisplayValue();
        var cell2Wins = cell2DataString.slice(2);
        var cell2Losses = cell2DataString.slice(0, 1);

        logStr += "(CELL[" + columnIndex + "," + columnToLetter(rowIndex) + "]-[" + cell2Wins + "W " + cell2Losses + "L])";

        if (cell1Wins != cell2Wins)
        {
          incorrectCells.push("Incorrect wins for " + player1Name + " VS " + player2Name);
        }

        if (cell1Losses != cell2Losses)
        {
          incorrectCells.push("Incorrect losses for " + player1Name + " VS " + player2Name);
        }
      }

      Logger.log(logStr);

      columnIndex++;
    }

    columnIndex = columnStart;
    rowIndex++;
  }

  Logger.log(logSeparatorLine);

  if (incorrectCells.length == incorrectCellsStartIndex)
  {
    Logger.log("FINISHED CHECKING! All cell values were correct");
  }
  else
  {
    Logger.log("FINISHED CHECKING! Some cell values were incorrect...");
    
    for (let i = incorrectCellsStartIndex; i < incorrectCells.length; i++)
    {
      Logger.log(incorrectCells[i]);
    }
  }
  
}

function letterToColumn(letter)
{
  let column = 0, length = letter.length;

  for (let i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }

  return column;
}

function columnToLetter(column)
{
  let temp, letter = '';

  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }

  return letter;
}