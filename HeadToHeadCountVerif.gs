function executeHeadToHeadVerif()//Run this function to perform the check
{
  let h2hSheet = SpreadsheetApp.setActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Head 2 Head"));
  let rowIndex = h2hDataRowStart;
  let columnIndex = h2hDataColumnStart;
  let logStr = "";
  let incorrectCells = [""];
  let incorrectCellsStartIndex = 1;

  while (h2hSheet.getRange(rowIndex, 1).isBlank() == false)
  {
    let player1Name = h2hSheet.getRange(rowIndex, 1).getDisplayValue();

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
        let player2Name = h2hSheet.getRange(1, columnIndex).getDisplayValue();
        let cell1DataString = h2hSheet.getRange(rowIndex, columnIndex).getDisplayValue();
        let cell1Wins = cell1DataString.slice(0, 1);
        let cell1Losses = cell1DataString.slice(2);

        logStr = player1Name + " VS " + player2Name + " (CELL[" + rowIndex + "," + columnToLetter(columnIndex) + "]-" + "[" + cell1Wins + "W " + cell1Losses + "L]) --- ";

        let cell2DataString = h2hSheet.getRange(columnIndex, rowIndex).getDisplayValue();
        let cell2Wins = cell2DataString.slice(2);
        let cell2Losses = cell2DataString.slice(0, 1);

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

    columnIndex = h2hDataColumnStart;
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
