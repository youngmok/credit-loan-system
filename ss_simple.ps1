Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinAPI {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@

# Kill ALL browsers
Get-Process msedge, chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 5

# Open dashboard in Edge InPrivate
$proc = Start-Process "msedge" "--inprivate --start-maximized http://localhost:3001" -PassThru
Start-Sleep -Seconds 8

# Force to front
$edgeProcs = Get-Process msedge -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero }
foreach ($p in $edgeProcs) {
    [WinAPI]::ShowWindow($p.MainWindowHandle, 3) | Out-Null
    [WinAPI]::SetForegroundWindow($p.MainWindowHandle) | Out-Null
}
Start-Sleep -Seconds 2

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap.Save("C:\workspaces\credit-loan-system\final_dashboard.png")
$graphics.Dispose()
$bitmap.Dispose()
Write-Output "Saved dashboard"

# Navigate to contract detail
$wshell = New-Object -ComObject wscript.shell
$wshell.SendKeys("^l")
Start-Sleep -Milliseconds 500
[System.Windows.Forms.Clipboard]::SetText("http://localhost:3001/loans/contracts/1")
$wshell.SendKeys("^v{ENTER}")
Start-Sleep -Seconds 5

$bitmap2 = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics2 = [System.Drawing.Graphics]::FromImage($bitmap2)
$graphics2.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap2.Save("C:\workspaces\credit-loan-system\final_detail.png")
$graphics2.Dispose()
$bitmap2.Dispose()
Write-Output "Saved detail"
Write-Output "Done"
