Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$tempProfile = "$env:TEMP\chrome_ss_temp"
if (Test-Path $tempProfile) { Remove-Item $tempProfile -Recurse -Force }

function Take-SS($url, $filename) {
    $proc = Start-Process "chrome" "--user-data-dir=$tempProfile --no-first-run --no-default-browser-check --window-size=1920,1080 --start-maximized $url" -PassThru
    Start-Sleep -Seconds 7

    # Bring Chrome to front
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class Win32 {
        [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
        [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    }
"@
    $chromeProcs = Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero }
    foreach ($p in $chromeProcs) {
        [Win32]::ShowWindow($p.MainWindowHandle, 3) | Out-Null  # SW_MAXIMIZE
        [Win32]::SetForegroundWindow($p.MainWindowHandle) | Out-Null
    }
    Start-Sleep -Seconds 2

    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("C:\workspaces\credit-loan-system\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output "Saved $filename"

    # Navigate to next URL using address bar
}

# Screenshot 1: Dashboard
Take-SS "http://localhost:3001" "final_dashboard.png"

# Navigate to contract detail
$wshell = New-Object -ComObject wscript.shell
$wshell.SendKeys('^l')
Start-Sleep -Milliseconds 300
$wshell.SendKeys('http://localhost:3001/loans/contracts/1{ENTER}')
Start-Sleep -Seconds 5

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap.Save("C:\workspaces\credit-loan-system\final_detail.png")
$graphics.Dispose()
$bitmap.Dispose()
Write-Output "Saved detail"

# Cleanup
Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.Path -and $_.CommandLine -match "chrome_ss_temp" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue

Write-Output "All done"
